fetch('/data/texts.json')
    .then(response => response.json())
    .then(data => {

        document.querySelector('.name-n-description > p').innerHTML = data.textos[0].conteudo;
    })