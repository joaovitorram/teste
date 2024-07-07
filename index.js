const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./database/users.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
});

// Servindo arquivos estáticos da pasta 'views'
app.use(express.static(path.join(__dirname, 'views')));

// Rota para exibir o formulário de cadastro
app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/cadastro.html'));
});

// Rota para processar o formulário de cadastro
app.post('/cadastro', (req, res) => {
  const { username, password } = req.body;
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
    if (err) {
      res.status(500).send("Erro ao cadastrar usuário");
    } else {
      res.redirect('/sucesso');
    }
  });
});

// Rota para exibir a página de sucesso
app.get('/sucesso', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/sucesso.html'));
});

// Rota para exibir o formulário de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (err) {
      res.status(500).send("Erro ao realizar login");
    } else if (row) {
      res.redirect('/sucesso');
    } else {
      res.status(400).send("Usuário ou senha inválidos");
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
