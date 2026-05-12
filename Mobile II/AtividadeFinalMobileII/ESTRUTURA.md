# 📁 Estrutura do Projeto

Este projeto segue a arquitetura de **separação entre Frontend, Backend e RestClient**.

## 🎯 Visão Geral

```
AtividadeFinalMobileII/
│
├── Front/                    ← 📱 APLICATIVO MÓVEL (React Native + Expo)
│   ├── app/                  Telas e navegação
│   ├── src/                  Componentes, utils, contexts
│   └── assets/               Imagens e ícones
│
├── Server/                   ← 🖥️ BACKEND (API REST + MongoDB)
│   ├── index.js              Servidor Express
│   └── package.json          Dependências do servidor
│
├── RestClient/               ← 🧪 TESTES DE API
│   └── teste.http            Requisições HTTP para testar endpoints
│
└── [docs & scripts]          ← 📚 DOCUMENTAÇÃO E UTILITÁRIOS
    ├── README.md             Guia principal
    ├── MONGODB-SETUP.md      Setup do MongoDB
    ├── TESTING.md            Checklist de testes
    ├── start.bat             Iniciar tudo (Windows)
    └── start.sh              Iniciar tudo (Linux/Mac)
```

## 🔄 Fluxo de Dados

```
┌─────────────────┐
│   Front/        │
│  (React Native) │
│                 │
│   📱 SQLite     │  ← Armazenamento local (sempre funciona)
│                 │
└────────┬────────┘
         │
         │ HTTP REST API
         │ (localhost:3000)
         │
┌────────▼────────┐
│   Server/       │
│   (Express.js)  │
│                 │
│   🗄️ MongoDB    │  ← Sincronização (quando online)
└─────────────────┘
```

## 🚀 Iniciar o Projeto

### ⚡ Modo Rápido (Recomendado)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

Isso irá:
1. Iniciar o servidor MongoDB (porta 3000)
2. Iniciar o app Expo automaticamente

---

### 🔧 Modo Manual

**1. Iniciar Backend:**
```bash
cd Server
npm install
npm start
```
✅ API rodando em: http://localhost:3000

**2. Iniciar Frontend:**
```bash
cd Front
npm install
npx expo start
```
✅ App disponível em: Android / iOS / Web

---

## 🧪 Testar API com RestClient

Abra o arquivo `RestClient/teste.http` no VS Code com a extensão **REST Client**.

Clique em "Send Request" acima de cada requisição para testar:
- Health check
- Listar usuários
- Criar usuário
- Atualizar usuário
- Deletar usuário

---

## 📂 Detalhes de Cada Pasta

### Front/ (Frontend)
- **Tecnologia:** React Native + Expo SDK 54
- **Linguagem:** TypeScript (app) + JavaScript (utils)
- **Database:** SQLite (local) + MongoDB (sync)
- **Navegação:** Expo Router (file-based)
- **UI:** LinearGradient, Ionicons, tema verde customizado

**Principais arquivos:**
- `app/_layout.tsx` - Navegação por tabs
- `app/cadastro.tsx` - Tela de cadastro com CEP
- `app/lista.tsx` - Lista paginada de usuários
- `app/admin.tsx` - Painel admin (CRUD)
- `src/utils/database.js` - Setup do SQLite
- `src/utils/storageService.js` - CRUD + sincronização
- `src/utils/mongodbService.js` - Cliente REST API

### Server/ (Backend)
- **Tecnologia:** Node.js + Express.js
- **Linguagem:** JavaScript
- **Database:** MongoDB (localhost:27017)
- **Porta:** 3000

**Principais arquivos:**
- `index.js` - API REST com todos os endpoints
- `test-connection.js` - Script de teste de conexão

**Endpoints disponíveis:**
- `GET /health` - Status do servidor
- `GET /api/usuarios` - Listar todos
- `POST /api/usuarios` - Criar
- `PUT /api/usuarios/:id` - Atualizar
- `DELETE /api/usuarios/:id` - Deletar
- `GET /api/usuarios/email/:email` - Buscar por email

### RestClient/ (Testes)
- **Ferramenta:** REST Client (VS Code Extension)
- **Arquivo:** `teste.http`

Permite testar todos os endpoints sem sair do editor.

---

## 🗄️ Bancos de Dados

### SQLite (Local)
- **Localização:** Dispositivo do usuário
- **Arquivo:** `usuarios.db` (criado automaticamente)
- **Uso:** Armazenamento offline + cache
- **Seed:** 12 usuários pré-cadastrados

### MongoDB (Sincronização)
- **URI:** `mongodb://localhost:27017`
- **Database:** `atividadeFinalMobile`
- **Collection:** `usuarios`
- **Uso:** Sincronização quando online
- **Fallback:** App funciona mesmo se MongoDB estiver offline

---

## 📱 Funcionalidades

✅ Cadastro de usuários com validação  
✅ Busca automática de endereço por CEP (ViaCEP)  
✅ Lista paginada (5 usuários por página)  
✅ Busca por nome ou ID  
✅ Painel admin com autenticação  
✅ CRUD completo (Create, Read, Update, Delete)  
✅ Sincronização dual-database (SQLite + MongoDB)  
✅ Indicador visual de conexão MongoDB  
✅ Modo offline (funciona sem internet)  

---

## 🎓 Contexto Acadêmico

- **Disciplina:** Mobile II
- **Semestre:** 5º
- **Objetivo:** Demonstrar integração Frontend-Backend com persistência dual

---

## 📚 Documentação Completa

- [README.md](./README.md) - Guia completo do projeto
- [Front/README.md](./Front/README.md) - Documentação do frontend
- [Server/README.md](./Server/README.md) - Documentação do backend
- [MONGODB-SETUP.md](./MONGODB-SETUP.md) - Setup detalhado do MongoDB
- [TESTING.md](./TESTING.md) - Checklist de testes passo a passo

---

🚀 **Desenvolvido com React Native + Express + MongoDB**
