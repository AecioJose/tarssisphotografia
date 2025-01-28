const bcrypt = require('bcryptjs');

// Senha a ser criptografada
const password = 'asenhaaqui';

// Criptografando a senha
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Erro ao criptografar a senha:', err);
    return;
  }

  // Agora você pode salvar a senha criptografada no seu arquivo JSON
  const user = {
    username: 'admin',
    password: hashedPassword
  };

  const fs = require('fs');
  const path = require('path');

  fs.writeFileSync(path.join(__dirname, 'data', 'users.json'), JSON.stringify([user], null, 2));

  console.log('Usuário com senha criptografada salva no arquivo JSON!');
});
