# 🚀 Como Executar o Projeto com MongoDB

Este projeto agora sincroniza dados **simultaneamente** em **SQLite (local)** e **MongoDB (Compass)**.

## 📋 Pré-requisitos

1. **MongoDB Compass** instalado e rodando localmente
2. **Node.js** instalado (v14 ou superior)
3. **Expo CLI** instalado globalmente

## 🔧 Configuração

### 1️⃣ Iniciar MongoDB

Certifique-se de que o MongoDB está rodando na porta padrão:
- **Porta:** 27017
- **Database:** `atividadeFinalMobile` (criado automaticamente)
- **Collection:** `usuarios` (criado automaticamente)

No MongoDB Compass, conecte em: `mongodb://localhost:27017`

### 2️⃣ Iniciar o Servidor MongoDB (Backend)

Abra um **primeiro terminal**:

```bash
cd "c:/5-Semestre/Mobile II/AtividadeFinalMobileII/Server"
npm install
npm start
```

Você verá:
```
✅ Conectado ao MongoDB
🚀 Servidor rodando em http://localhost:3000
📊 MongoDB: mongodb://localhost:27017/atividadeFinalMobile
```

### 3️⃣ Iniciar o App React Native

Abra um **segundo terminal**:

```bash
cd "c:/5-Semestre/Mobile II/AtividadeFinalMobileII"
npx expo start
```

Escolha:
- `a` para Android
- `i` para iOS
- `w` para Web

## ✅ Como Funciona

### Quando você **cadastra** um usuário:
1. ✅ Salva no **SQLite** (banco local do app)
2. ✅ Envia simultaneamente para o **MongoDB** via API REST

### Quando você **edita** um usuário:
1. ✅ Atualiza no **SQLite**
2. ✅ Sincroniza a atualização no **MongoDB** (busca por email)

### Quando você **deleta** um usuário:
1. ✅ Remove do **SQLite**
2. ✅ Remove também do **MongoDB** (busca por email)

## 🔍 Verificar Sincronização

### No MongoDB Compass:
1. Conecte em `mongodb://localhost:27017`
2. Selecione database: `atividadeFinalMobile`
3. Abra collection: `usuarios`
4. Veja os dados sincronizados em tempo real!

### Logs no Terminal:
- ✅ `Salvo no MongoDB` — quando salva com sucesso
- ✅ `Atualizado no MongoDB` — quando atualiza
- ✅ `Deletado do MongoDB` — quando deleta
- ⚠️ `MongoDB indisponível` — se o servidor estiver offline (não bloqueia o app)

## 🛡️ Modo Offline

Se o servidor MongoDB estiver **offline**:
- ✅ O app continua funcionando normalmente
- ✅ Dados são salvos apenas no SQLite
- ⚠️ Avisos são exibidos no console (não bloqueiam o usuário)

## 📡 Endpoints da API

### Servidor MongoDB: `http://localhost:3000`

- `GET /health` — Status do servidor
- `POST /api/usuarios` — Criar usuário
- `GET /api/usuarios` — Listar todos
- `GET /api/usuarios/:id` — Buscar por ID do MongoDB
- `GET /api/usuarios/email/:email` — Buscar por email
- `PUT /api/usuarios/:id` — Atualizar
- `DELETE /api/usuarios/:id` — Deletar

## 🐛 Troubleshooting

### Erro: "MongoDB indisponível"
- Verifique se o MongoDB está rodando
- Confirme se o servidor Node.js está ativo (`http://localhost:3000/health`)

### Porta 3000 já está em uso
Edite `mongodb-server/index.js` e mude:
```javascript
const PORT = 3001; // ou outra porta disponível
```

### Dados não aparecem no MongoDB Compass
- Recarregue a collection (F5)
- Verifique logs do servidor Node.js
- Teste: `curl http://localhost:3000/api/usuarios`

## 📦 Estrutura de Dados

```json
{
  "_id": "ObjectId gerado pelo MongoDB",
  "id": 123,
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "telefone": "(11) 99999-9999",
  "cep": "01310-100",
  "rua": "Avenida Paulista",
  "numero": "1000",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "uf": "SP",
  "dataCadastro": "12/05/2026",
  "createdAt": "2026-05-12T19:34:56.789Z"
}
```

## 🎯 Resumo

**2 Bancos de Dados Sincronizados:**
- 📱 **SQLite** — Local no dispositivo
- 🌐 **MongoDB** — Compass local (localhost:27017)

Todos os dados são salvos em **tempo real** nos dois bancos! 🚀
