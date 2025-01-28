// Pages de carrossel
fetch('/data/carrossel.json')
    .then(response => response.json())
    .then(data => {
        const portfolioButtons = document.querySelector('.portfolio-buttons');
        let currentActiveButton = null; // Variável para rastrear o botão ativo

        // Função para atualizar o estilo do botão ativo
        function updateActiveButton(newActiveButton) {
            if (currentActiveButton) {
                // Remove o estilo de sublinhado do botão anterior
                currentActiveButton.style.textDecoration = 'none';
            }
            // Define o novo botão como ativo e aplica o estilo
            currentActiveButton = newActiveButton;
            currentActiveButton.style.textDecoration = 'underline';
            currentActiveButton.style.textDecorationThickness = "3px";
            currentActiveButton.style.textDecorationColor = "#f14800";
            currentActiveButton.style.textUnderlineOffset = "8px";
        }

        // Percorre as chaves do JSON e cria os botões
        let isFirst = true;
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const h2 = document.createElement('h2');
                h2.innerHTML = key;

                // Normaliza o texto para criar o ID
                const normalizedKey = key
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/ç/g, "c")
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .toLowerCase();
                h2.id = `button-${normalizedKey}`;

                // Adiciona o evento de clique ao botão
                h2.addEventListener('click', () => {
                    updateActiveButton(h2); // Atualiza o botão ativo
                    renderBannerCarrossel(key); // Chama a função para renderizar o carrossel
                });

                portfolioButtons.appendChild(h2);

                // Se for o primeiro botão, define como ativo e chama a função renderBannerCarrossel
                if (isFirst) {
                    updateActiveButton(h2);
                    renderBannerCarrossel(key);
                    isFirst = false;
                }
            }
        }
    });


//Renedrizar carrossel
// 4, 6 ou 9
const clearSpace = [2, 6, 7, 11, 13, 15]; // Lista de elementos a serem 'div'

function renderBannerCarrossel(parametro) {
    fetch('/data/carrossel.json')
        .then(response => response.json())
        .then(data => {
            const layout = data[parametro][0].Layout;
            const grid = layout === 4 ? 6 : layout === 6 ? 9 : layout === 9 ? 15 : 0;

            // Limpar todos os filhos da tag portfolio antes de adicionar novos
            const portfolio = document.querySelector('.portfolio');
            portfolio.innerHTML = '';

            // Loop para adicionar os elementos
            let a = 1;
            for (let i = 1; i <= grid; i++) {
                const element = document.createElement(clearSpace.includes(i) ? 'div' : 'img');
                element.classList.add('img-container');

                if (!clearSpace.includes(i)) {
                    
                    const capa = data[parametro][a].imagesIDs[0]; // Pega o primeiro ID de imagem
                    a++
                    fetch('/data/images.json')
                        .then(response => response.json())
                        .then(imagesData => {
                            const imageData = imagesData.imagens.find(image => image.id === capa);
                            if (imageData) {
                                element.src = imageData.caminho;
                                element.alt = imageData.descricao;
                            }
                        });
                } else {
                    element.classList.add('clear-container');
                }

                portfolio.appendChild(element);
            }
        });
}

