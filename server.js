const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware para parsear o corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos (imagens, css, js)
// app.use(express.static(path.join(__dirname, 'public')));

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
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json')));
  const user = users.find(u => u.username === username);

  // Comparar a senha
  console.log('Comparando senha: ', password, user?.password);

  if (user && bcrypt.compareSync(password, user.password)) {
    // Se o login for bem-sucedido, redirecionar para a página de administração
    res.redirect('/admin/dashboard');
  } else {
    res.status(401).send('Credenciais inválidas');
  }
});

// Rota para o painel de administração (após login)
app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'html', 'admin.html'));
});

// Rota para editar o conteúdo da página de portfolio
app.post('/admin/update', (req, res) => {
  const { title, description, image } = req.body;

  // Salvar os novos dados do portfolio (aqui você pode salvar em um banco de dados ou JSON)
  const portfolioData = { title, description, image };
  fs.writeFileSync(path.join(__dirname, 'data', 'portfolio.json'), JSON.stringify(portfolioData));

  res.send('Portfolio atualizado com sucesso!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
