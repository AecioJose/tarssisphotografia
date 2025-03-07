const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware para parsear o corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do session
app.use(session({
  secret: 'seu-segredo-aqui', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Servir arquivos estáticos (imagens, css, js)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página estática do Portfolio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'html', 'index.html'));
});

// Rota para a página de login/admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'html', 'login.html'));
});

// Rota POST para o login do admin
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verificar se o usuário e senha correspondem
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'secure', 'data', 'users.json')));
  const user = users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.isAuthenticated = true;
    res.redirect('/admin/dashboard');
  } else {
    res.status(401).send('Credenciais inválidas');
  }
});

// Rota para o painel de administração (após login)
app.get('/admin/dashboard', (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/admin'); // Redireciona para o login se não autenticado
  }
  res.sendFile(path.join(__dirname, 'views', 'html', 'admin.html'));
});

// Rota de logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Erro ao sair.');
    }
    res.redirect('/admin'); // Redireciona para o login
  });
});

// Redirecionamento de /links para o linktree
app.get('/links', (req, res) => {
  res.redirect('https://linktr.ee/pereiraphotografia');
});


// Rota para editar o conteúdo da seção services

// app.post('/admin/renameService', (req, res) => {
//   const { oldKey, newKey } = req.body;

//   // Caminho do arquivo JSON
//   const filePath = path.join(__dirname, 'public', 'data', 'services.json');

//   // Ler o JSON
//   const services = JSON.parse(fs.readFileSync(filePath, 'utf8'));

//   // Verifica se a chave antiga existe e a nova não existe
//   if (!services[oldKey]) {
//     return res.status(400).send({ error: 'Chave antiga não encontrada.' });
//   }
//   if (services[newKey]) {
//     return res.status(400).send({ error: 'A nova chave já existe.' });
//   }

//   // Criar um novo objeto mantendo a ordem das chaves
//   const newServices = {};

//   // Adiciona as chaves até a chave que será renomeada
//   for (const key in services) {
//     if (key === oldKey) {
//       newServices[newKey] = services[key]; // Renomeia a chave
//     } else {
//       newServices[key] = services[key]; // Mantém as outras chaves na mesma ordem
//     }
//   }

//   // Salva o JSON atualizado
//   fs.writeFileSync(filePath, JSON.stringify(newServices, null, 2));

//   res.send({ success: true, message: `Serviço '${oldKey}' renomeado para '${newKey}'!` });
// });


app.post('/admin/editService', (req, res) => {
  const { key, field, value } = req.body;

  // Caminho do arquivo JSON
  const filePath = path.join(__dirname, 'public', 'data', 'services.json');

  // Ler o JSON
  const services = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Verifica se a chave existe no JSON
  if (!services[key]) {
    return res.status(400).send({ error: 'Chave não encontrada.' });
  }

  // Verifica se o campo existe
  if (!['imagem', 'text', 'altImagem'].includes(field)) {
    return res.status(400).send({ error: 'Campo inválido.' });
  }

  // Edita o valor do campo
  services[key][0][field] = value;

  // Criar um novo objeto mantendo a ordem das chaves
  const newServices = {};
  for (const key in services) {
    newServices[key] = services[key]; // Mantém as outras chaves na mesma ordem
  }

  // Salva o JSON atualizado
  fs.writeFileSync(filePath, JSON.stringify(newServices, null, 2));

  res.send({ success: true, message: `Campo '${field}' do serviço '${key}' atualizado!` });
});

// Rota para renomear a chave principal de services.json
app.post('/admin/renameMainKey', (req, res) => {
  const { oldKey, newKey } = req.body;

  // Caminho do arquivo JSON
  const filePath = path.join(__dirname, 'public', 'data', 'services.json');

  // Ler o JSON
  const services = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Verifica se a chave antiga existe e a nova não existe
  if (!services[oldKey]) {
    return res.status(400).send({ error: 'Chave antiga não encontrada.' });
  }
  if (services[newKey]) {
    return res.status(400).send({ error: 'A nova chave já existe.' });
  }

  // Criar um novo objeto mantendo a ordem das chaves
  const newServices = {};

  // Adiciona as chaves até a chave que será renomeada
  for (const key in services) {
    if (key === oldKey) {
      newServices[newKey] = services[key]; // Renomeia a chave principal
    } else {
      newServices[key] = services[key]; // Mantém as outras chaves na mesma ordem
    }
  }

  // Salva o JSON atualizado
  fs.writeFileSync(filePath, JSON.stringify(newServices, null, 2));

  res.send({ success: true, message: `Chave '${oldKey}' renomeada para '${newKey}'!` });
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
