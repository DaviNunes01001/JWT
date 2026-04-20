// Framework HTTP para criar o servidor e definir rotas
import express from "express";

// Biblioteca para gerar e verificar tokens JWT
import jwt from "jsonwebtoken";

// Instancia o app Express
const app = express();

// Porta que o servidor vai escutar
const PORT = 3001;

// Chave secreta usada para assinar os tokens
// Em produção: sempre via variável de ambiente, nunca hardcoded
const SECRET_KEY = process.env.JWT_SECRET ?? "dev-only-secret";

// Middleware que parseia o body das requisições como JSON
// Sem isso, req.body chega undefined
app.use(express.json());

// Simulação de banco de dados em memória
// Em produção: substituir por query no banco real com senha em hash (bcrypt)
const users = [
  { id: 1, username: "nunesDV", password: "123456", role: "admin" },
  { id: 2, username: "nunesDB", password: "123456", role: "user" },
];

// Rota de autenticação — recebe username/password, devolve JWT
app.post("/login", (req, res) => {
  // Extrai as credenciais do corpo da requisição
  const { username, password } = req.body;

  // Busca um usuário que bata com username E password
  // Em produção: usar bcrypt.compare() — nunca comparar hash direto com ==
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    // Gera o token JWT com o payload (dados públicos do usuário)
    // Nunca coloque senha ou dados sensíveis no payload — ele é apenas codificado, não criptografado
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }, // Token expira em 1 hora
    );

    // Retorna o token pro cliente
    res.json({ token });
  } else {
    // Credenciais inválidas — 401 Unauthorized
    res.status(401).json({ message: "usuario ou senha invalidos" });
  }
});

// criação de middwalre pra validação de rota
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  // se o token não for fornecido
  // VERIFICAÇÃO
  if (!token) return res.status(403).json({ message: "Token não fornecido" });

  // se o token vor invalido, ou modificado
  // VERIFICAÇÃO
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "token invalido!" });
    req.user = user;
    next();
  });
};

// Rota protegiada com Token
app.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Bem vindo á rota autenticada!" });
});

//Rota privada
app.get("/admin", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado!" });
  }
  res.status(200).json({ message: `Bem vindo Senhor ADMIN:` });
});

// Sobe o servidor na porta definida
app.listen(PORT, () => console.log(`Rodando na ${PORT}`));
