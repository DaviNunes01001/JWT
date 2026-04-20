# JWT Auth API

API REST simples de autenticação com JSON Web Token usando Node.js e Express.

---

## Stack

- **Node.js** — runtime
- **Express 5** — framework HTTP
- **jsonwebtoken** — geração e verificação de JWT

---

## Instalação

```bash
git clone https://github.com/DaviNunes01001/JWT.git
cd JWT
npm install
```

---


## Rodando

```bash
npm start
```

Servidor sobe em `http://localhost:3001`.

---

## Rotas

### `POST /login`

Autentica o usuário e retorna um token JWT.

**Body:**
```json
{
  "username": "nunesDV",
  "password": "123456"
}
```

**Resposta 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta 401:**
```json
{
  "message": "usuario ou senha invalidos"
}
```

---

### `GET /protected`

Rota protegida — exige token válido no header.

**Header:**
```
Authorization: <token>
```

**Resposta 200:**
```json
{
  "message": "Bem vindo á rota autenticada!"
}
```

**Resposta 403:**
```json
{
  "message": "Token não fornecido"
}
```

---

## Testando com Insomnia

1. Faça `POST /login` com as credenciais
2. Copie o token retornado
3. Faça `GET /protected` com o header `Authorization: <token>`

---

## Usuários de teste (mock)

| username | password | role  |
|----------|----------|-------|
| nunesDV  | 123456   | admin |
| nunesDB  | 123456   | user  |

---

## Avisos
- API simples de autenticação apenas para testar o metodo JWT
