fetch('/data/texts.json')
    .then(response => response.json())
    .then(data => {

        document.querySelector('.name-n-description > p').innerHTML = data.textos[0].conteudo;
    })

fetch('/data/images.json')
    .then(response => response.json())
    .then(data => {

        document.querySelector('main').style.backgroundImage = `url('${data.images[0].caminho}')`;
    })
