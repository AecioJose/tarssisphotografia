fetch('/data/services.json')
    .then(response => response.json())
    .then(data => {
        const sectionContainer = document.querySelector('.services-container'); 
        let isEven = false;  // Variável para controlar se a div é ímpar ou par

        
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                // Cria a div para cada chave
                const serviceDiv = document.createElement('div');
                serviceDiv.classList.add('services');

                if (isEven) {// Adiciona a classe 'servicesorange' apenas para as divs pares
                    serviceDiv.classList.add('servicesorange');
                }

                // Quebra de linha no p se no json tiver \n
                const formattedText = data[key][0].text.replace(/\n/g, '<br>');

                // Mensagem personalizada para o WhatsApp
                const message = `Olá Társsis! vim pelo seu site, gostaria de fazer um orçamento do pacote ${key}`;
                const encodedMessage = encodeURIComponent(message); // Codifica a mensagem para a URL


                serviceDiv.innerHTML = `
                    <div class="services-text-container">
                        <h2>${key}</h2>
                        <div>
                            <p class="subtitleServices">{O que está incluso no pacote ${key}}</p>
                            <p class="servicesDescription">${formattedText}</p>
                        </div>
                    </div>
                    <div class="services-img-container">
                        <img src="${data[key][0].imagem}" alt="${data[key][0].altImagem}">
                        <a href="https://wa.me/557191518402?text=${encodedMessage}">Pedir orçamento</a>
                    </div>`;

                sectionContainer.appendChild(serviceDiv);

                // Alterna entre div ímpar e par
                isEven = !isEven;
            }
        }
    })
    .catch(error => console.error('Erro ao carregar o JSON:', error));
