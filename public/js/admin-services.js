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


                serviceDiv.innerHTML = `
                    <div class="services">
                        <span class="excluirService">Excluir</span>
                        <div class="services-text-container">
                            <h2 style="display: flex; gap: 8px; align-items: center;" >${key} <span onclick="renomearService('${key}', this)" style="margin: auto 0;" class="renomearServices">Renomear</span> </h2>
                            <div class="text-containerServices">
                                <p class="subtitleServices">{O que está incluso no pacote ${key}}</p>
                                <p class="servicesDescription">${formattedText}</p>
                            </div>
                            <span class="editartxtServices">Editar Texto</span>
                        </div>
                        <div class="services-img-container">
                            <img class="imgservice" src="${data[key][0].imagem}" alt="${data[key][0].altImagem}">
                            <span class="mudarImagemService" >Mudar Imagem</span>
                        </div>
                    </div>
                    `

                sectionContainer.appendChild(serviceDiv);

                // Alterna entre div ímpar e par
                isEven = !isEven;
            }
        }
        const adicionar = document.createElement('span')
        adicionar.innerHTML = 'Adicionar Novo Serviço +'
        adicionar.classList.add("adicionarService");
        document.querySelector('.services-container').appendChild(adicionar)
    })
    .catch(error => console.error('Erro ao carregar o JSON:', error));

// function renomearService(key, me){
//     console.log('entrou la ele  ', key, me)
//     console.log(me.parentElement)
// }

function renomearService(key, me) {
    let h2 = me.closest("h2"); // Pega o elemento <h2> mais próximo
    let subTitle = me.parentElement.parentElement.querySelector('.subtitleServices')
    let nomeAtual = h2.childNodes[0].textContent.trim(); // Pega o nome salvo antes

    // Criar o input
    let input = document.createElement("input");
    input.type = "text";
    input.value = nomeAtual;
    input.classList.add("input-renomear");
    input.style.padding = "4px";
    input.style.fontSize = "1rem";
    input.style.border = "none";
    // input.style.width = "min-content";

    // Criar botão Salvar
    let botaoSalvar = document.createElement("span");
    botaoSalvar.textContent = "Salvar";
    botaoSalvar.classList.add("salvarService");
    botaoSalvar.style.background = "green";
    botaoSalvar.style.color = "#fff";
    botaoSalvar.style.padding = "3px 10px";
    botaoSalvar.style.cursor = "pointer";
    botaoSalvar.style.borderRadius = "30px";
    botaoSalvar.style.marginLeft = "4px";
    botaoSalvar.style.fontSize = "0.8rem";

    // Substituir elementos no DOM sem usar innerHTML
    h2.innerHTML = "";
    h2.appendChild(input);
    h2.appendChild(botaoSalvar);

    input.focus(); // Dá foco no input automaticamente

    function cancelarEdicao() {
        h2.innerHTML = "";
        h2.textContent = nomeAtual;
        let novoSpan = document.createElement("span");
        novoSpan.textContent = "Renomear";
        novoSpan.classList.add("renomearServices");
        novoSpan.style.margin = "auto 0";
        novoSpan.onclick = function () {
            renomearService(nomeAtual, this);
        };
        h2.appendChild(novoSpan);
        removerEventos();
    }

    function salvarEdicao() {
        let novoNome = input.value.trim();
        if (novoNome === "") novoNome = nomeAtual; // Se estiver vazio, mantém o nome anterior
        h2.innerHTML = "";
        h2.textContent = novoNome;
        let novoSpan = document.createElement("span");
        novoSpan.textContent = "Renomear";
        novoSpan.classList.add("renomearServices");
        novoSpan.style.margin = "auto 0";
        novoSpan.onclick = function () {
            renomearService(novoNome, this);
        };
        h2.appendChild(novoSpan);
        removerEventos();
    }

    function clickFora(e) {
        if (e.target !== input && e.target !== botaoSalvar) {
            cancelarEdicao();
        }
    }

    function removerEventos() {
        document.removeEventListener("click", clickFora);
    }

    // function saveTextJson(key) {
    //     let novoNome = input.value.trim();
        
    //     if (!novoNome || novoNome === key) return; // Se estiver vazio ou igual, não faz nada
    
    //     fetch('/admin/renameService', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ oldKey: key, newKey: novoNome })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.success) {
    //             console.log(data.message);
    //             // Aqui você pode atualizar a interface se necessário
    //         } else {
    //             console.error('Erro:', data.error);
    //         }
    //     })
    //     .catch(error => console.error('Erro ao renomear serviço:', error));
    // }

    // Função para salvar os dados editados no JSON
    function saveTextJson(key, field) {
        const input = document.getElementById(`${field}-${key}`);
        const newValue = input.value.trim();
        
        if (!newValue) return; // Se o valor estiver vazio, não faz nada
        
        fetch('/admin/editService', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: key, field: field, value: newValue })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.message);
                // Aqui você pode atualizar a interface, se necessário
            } else {
                console.error('Erro:', data.error);
            }
        })
        .catch(error => console.error('Erro ao editar serviço:', error));
    }

    // Função para renomear a chave principal
    function renameMainKey(oldKey) {
        let novoNome = input.value.trim();

        //Renomei o subtitle
        subTitle.innerHTML = `{O que está incluso no pacote ${novoNome}}`
        
        if (!novoNome || novoNome === oldKey) return; // Se estiver vazio ou igual, não faz nada
        
        fetch('/admin/renameMainKey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldKey: oldKey, newKey: novoNome })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.message);
                // Aqui você pode atualizar a interface se necessário
            } else {
                console.error('Erro:', data.error);
            }
        })
        .catch(error => console.error('Erro ao renomear chave:', error));
    }


    

    botaoSalvar.addEventListener("click", (e) => {
        e.stopPropagation();
        salvarEdicao();
        // saveTextJson(key, "text ou altImagem ou imagem");
        renameMainKey(key)
        // console.log(key)
    });

    setTimeout(() => {
        document.addEventListener("click", clickFora);
    }, 10);
}


