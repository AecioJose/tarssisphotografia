fetch('/data/texts.json')
    .then(response => response.json())
    .then(data => {

        document.querySelector('.about-me-TEXT-container > p').innerHTML = data.textos[1].conteudo;
    })