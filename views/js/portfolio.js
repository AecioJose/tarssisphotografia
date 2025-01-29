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
                // const element = document.createElement(clearSpace.includes(i) ? 'div' : 'img');
                const element = document.createElement('div')
                element.classList.add('img-container');

                if (!clearSpace.includes(i)) {
                    
                    const capa = data[parametro][a].imagesIDs[0]; // Pega o primeiro ID de imagem
                    a++
                    fetch('/data/images.json')
                        .then(response => response.json())
                        .then(imagesData => {
                            const imageData = imagesData.images.find(image => image.id === capa);
                            if (imageData) {
                                const img = document.createElement('img')
                                img.src = imageData.caminho;
                                img.alt = imageData.descricao;
                                element.appendChild(img)

                                const carrosselButton = document.createElement('div')
                                carrosselButton.innerHTML = `<svg aria-label="Carousel" class="x1lliihq x1n2onr6 x9bdzbf" fill="currentColor" height="20" role="img" viewBox="0 0 48 48" width="20"><title>Carousel</title><path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path></svg>`
                                element.appendChild(carrosselButton)
                                // Adicionar evento de clique para abrir o pop-up
                                element.addEventListener('click', () => openCarrosselPopUp(data[parametro][a - 1].imagesIDs));
                            }
                        });
                } else {
                    element.classList.add('clear-container');
                }

                portfolio.appendChild(element);
            }
        });
}


function openCarrosselPopUp(imagesIDs) {
    console.log(imagesIDs)
    fetch('/data/images.json')
        .then(response => response.json())
        .then(imagesData => {
            const carrosselContainer = document.createElement('div');
            carrosselContainer.classList.add('carrossel-container');

            let currentIndex = 0;
            const images = imagesIDs.map(id => imagesData.images.find(image => image.id === id));

            carrosselContainer.innerHTML = `
                <span class="close" style="display: inline-block; width: 35px; height: 35px; position: absolute; cursor: pointer; z-index: 999;">
                    <span style="content: ''; position: absolute; top: 50%; left: 50%; width: 20px; height: 2px; background-color: #fff; transform: translate(-50%, -50%) rotate(45deg);"></span>

                    <span style="content: ''; position: absolute; top: 50%; left: 50%; width: 20px; height: 2px; background-color: #fff; transform: translate(-50%, -50%) rotate(-45deg);"></span>
                </span>

                <div>
                    <img src="${images[0].caminho}" alt="${images[0].descricao}" id="imgCarrossel">

                    <div class="container-arrows">
                        <span id="prevArrow" style="display: inline-block; background-repeat: no-repeat; background-position: -130px -98px; height: 30px; width: 30px; background-image: url('/public/arrow.png')"></span>

                        <span id="nextArrow" style="display: inline-block; background-repeat: no-repeat; background-position: -162px -98px; height: 30px; width: 30px; background-image: url('/public/arrow.png')"></span>

                    </div>

                    <div class="dots">
                    
                    </div>
                </div>
            `
            // Adicionar o carrossel ao body
            document.body.appendChild(carrosselContainer);

            const imageElement = document.querySelector("#imgCarrossel");
            imageElement.src = images[currentIndex].caminho;
            imageElement.alt = images[currentIndex].descricao;

            // Dots de navegação
            const dotsContainer = document.querySelector(".dots")
            images.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.addEventListener('click', () => changeImage(index, imageElement, dotsContainer, images));
                dotsContainer.appendChild(dot);
            });
            carrosselContainer.appendChild(dotsContainer);

            // Funções para navegar entre as imagens
            function changeImage(index, imgElement, dotsElement, images) {
                imgElement.src = images[index].caminho;
                imgElement.alt = images[index].descricao;
                currentIndex = index;

                // Atualizar dots
                const dots = dotsElement.querySelectorAll('.dot');
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === currentIndex);
                });
            } changeImage(currentIndex, imageElement, dotsContainer, images);

            // Setas de navegação
            const prevArrow = document.querySelector('#prevArrow');
            prevArrow.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                changeImage(currentIndex, imageElement, dotsContainer, images);
            });

            const nextArrow = document.querySelector('#nextArrow');
            nextArrow.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % images.length;
                changeImage(currentIndex, imageElement, dotsContainer, images);
            });

            // Fechar o carrossel
            document.querySelector('.close').addEventListener('click', () => carrosselContainer.remove());


            //Ajusta as arrows ao tamanho da imagem
            document.querySelector("#imgCarrossel").addEventListener("load", () => {
                document.querySelector('.container-arrows').style.width =
                    `${document.querySelector('#imgCarrossel').getBoundingClientRect().width}px`;
                
                    document.querySelector('.container-arrows').style.left =
                    `${document.querySelector('#imgCarrossel').getBoundingClientRect().left}px`;
            });

            //Ajusta a altura dos dots a imagem
            document.querySelector("#imgCarrossel").addEventListener("load", () => {
                document.querySelector('.dots').style.top =
                    `${document.querySelector('#imgCarrossel').getBoundingClientRect().bottom - 20}px`;
            });

        });
}
