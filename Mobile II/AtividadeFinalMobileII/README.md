# 📱 Atividade Final Mobile II

Aplicativo React Native (Expo) com cadastro de usuários e sincronização **dual-database**:
- **SQLite** (local no dispositivo)
- **MongoDB** (Compass local via API REST)

## 🎯 Funcionalidades

✅ Cadastro de usuários com busca automática de CEP (ViaCEP)  
✅ Listagem paginada com busca por nome/ID  
✅ Painel administrativo com CRUD completo  
✅ Autenticação de admin (login: `admin` / senha: `admin123`)  
✅ **Sincronização automática SQLite ↔ MongoDB**  
✅ Indicador visual de status do MongoDB  
✅ Modo offline (funciona sem MongoDB)  

## 🚀 Início Rápido

### Opção 1: Script Automático (Windows)
```bash
start.bat
```

### Opção 2: Script Automático (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

### Opção 3: Manual

**Terminal 1 — MongoDB Server:**
```bash
cd Server
npm install
npm start
```

**Terminal 2 — Expo App:**
```bash
cd Front
npm install
npx expo start
```

## 📊 Bancos de Dados

### SQLite (Local)
- **Arquivo:** `usuarios.db`
- **Tabela:** `usuarios` (12 campos)
- **Seed:** 12 usuários pré-cadastrados

### MongoDB (Compass)
- **URI:** `mongodb://localhost:27017`
- **Database:** `atividadeFinalMobile`
- **Collection:** `usuarios`
- **Sincronização:** Tempo real via API REST (porta 3000)

## 🔗 Sincronização

Todas as operações são **automaticamente sincronizadas**:

| Operação | SQLite | MongoDB | Fallback |
|----------|--------|---------|----------|
| **CREATE** | ✅ | ✅ | SQLite only se offline |
| **READ** | ✅ | ❌ | Sempre do SQLite |
| **UPDATE** | ✅ | ✅ | SQLite only se offline |
| **DELETE** | ✅ | ✅ | SQLite only se offline |

## 🛠️ Tecnologias

### Frontend (App)
- React Native (Expo SDK 54)
- TypeScript
- Expo Router (navegação)
- Expo SQLite
- Expo Linear Gradient
- React Navigation
- AsyncStorage

### Backend (MongoDB Server)
- Node.js + Express
- MongoDB Driver
- CORS
- Body Parser

## 📂 Estrutura do Projeto

```
AtividadeFinalMobileII/
├── Front/                       # Frontend (React Native + Expo)
│   ├── app/                     # Telas do app
│   │   ├── _layout.tsx         # Navegação (tabs)
│   │   ├── index.tsx           # Rota inicial (redireciona)
│   │   ├── cadastro.tsx        # Tela de cadastro
│   │   ├── lista.tsx           # Lista de usuários
│   │   └── admin.tsx           # Painel admin (CRUD)
│   ├── src/
│   │   ├── components/
│   │   │   └── MongoDBStatus.tsx  # Indicador de conexão
│   │   ├── constants/
│   │   │   └── theme.ts        # Cores e estilos
│   │   ├── context/
│   │   │   └── AuthContext.tsx # Autenticação admin
│   │   └── utils/
│   │       ├── database.js     # SQLite (init + seed)
│   │       ├── storageService.js   # CRUD SQLite + sync MongoDB
│   │       ├── mongodbService.js   # API REST MongoDB
│   │       └── cepService.js   # Consulta ViaCEP
│   ├── assets/                 # Imagens
│   ├── package.json
│   ├── app.json
│   └── tsconfig.json
├── Server/                      # Backend (API REST + MongoDB)
│   ├── index.js                # Servidor Express
│   ├── package.json
│   └── test-connection.js      # Script de teste
├── RestClient/                  # Testes de API
│   └── teste.http              # Requisições HTTP
├── start.bat                    # Iniciar tudo (Windows)
├── start.sh                     # Iniciar tudo (Linux/Mac)
├── README.md                    # Este arquivo
├── MONGODB-SETUP.md            # Guia MongoDB
└── TESTING.md                   # Checklist de testes

```

## 🔍 Telas

### 1️⃣ Cadastro
- Formulário completo com validação
- Busca automática de endereço por CEP
- Seletor de UF (modal)
- Indicador de status MongoDB

### 2️⃣ Lista
- Paginação (5 usuários por página)
- Busca por nome ou ID
- Pull-to-refresh
- Exibição condicional de ID (apenas para admin)

### 3️⃣ Admin (requer login)
- Login: `admin` / Senha: `admin123`
- CRUD completo (criar, editar, deletar)
- Busca integrada
- Modais para criação/edição
- Indicador de status MongoDB

## ⚙️ Configuração

### Variáveis de Ambiente (opcional)

Edite `Front/src/utils/mongodbService.js` para alterar a URL da API:
```javascript
const MONGODB_API_URL = 'http://localhost:3000/api';
```

Edite `Server/index.js` para alterar porta ou URI do MongoDB:
```javascript
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'atividadeFinalMobile';
```

## 🧪 Testar Sincronização

1. Inicie o MongoDB Compass e conecte em `mongodb://localhost:27017`
2. Execute o app e o servidor MongoDB
3. Cadastre um usuário no app
4. No MongoDB Compass:
   - Selecione database `atividadeFinalMobile`
   - Abra collection `usuarios`
   - Veja o usuário recém-cadastrado! 🎉

## 📱 Dispositivos Testados

- ✅ Android (emulador e físico)
- ✅ iOS (emulador)
- ✅ Web (navegador)

**Nota:** Para testar no dispositivo físico, altere `localhost` para o IP local da máquina em `mongodbService.js`.

## 🐛 Troubleshooting

### MongoDB Offline
- ✅ App continua funcionando
- ⚠️ Dados salvos apenas no SQLite
- 🔄 Sincronização automática ao reconectar

### Porta 3000 ocupada
Altere em `Server/index.js`:
```javascript
const PORT = 3001;
```

### Erro ao buscar CEP
- Verifique conexão com internet
- API: https://viacep.com.br

## 📄 Licença

Projeto acadêmico - 5º Semestre - Mobile II

---

🚀 **Desenvolvido com React Native + Expo + MongoDB**
