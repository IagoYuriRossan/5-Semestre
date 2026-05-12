# Frontend - Atividade Final Mobile II

Aplicação React Native com Expo SDK para cadastro de usuários com sincronização dual-database.

## 🎯 Estrutura

```
Front/
├── app/                      # Screens (Expo Router)
│   ├── _layout.tsx          # Tab Navigation
│   ├── index.tsx            # Entry Point
│   ├── cadastro.tsx         # User Registration
│   ├── lista.tsx            # User List (Paginated)
│   └── admin.tsx            # Admin Panel (CRUD)
├── src/
│   ├── components/
│   │   └── MongoDBStatus.tsx    # Connection Status Indicator
│   ├── constants/
│   │   └── theme.ts         # Colors & Styling
│   ├── context/
│   │   └── AuthContext.tsx  # Admin Authentication
│   └── utils/
│       ├── database.js      # SQLite Setup & Seed
│       ├── storageService.js    # CRUD Operations
│       ├── mongodbService.js    # MongoDB REST Client
│       └── cepService.js    # ViaCEP Integration
├── assets/                   # Images & Icons
├── package.json
├── app.json                 # Expo Configuration
└── tsconfig.json            # TypeScript Config
```

## 🚀 Iniciar

### Opção 1: Script Automático (usa com o Server/)
Na pasta raiz do projeto:
```bash
# Windows
..\start.bat

# Linux/Mac
..\start.sh
```

### Opção 2: Manual
```bash
cd Front
npm install
npx expo start
```

Pressione:
- `w` para abrir no navegador
- `a` para Android emulator
- `i` para iOS simulator

## 📱 Telas

### 1️⃣ Cadastro (`/cadastro`)
- Formulário completo com validação
- Busca automática de endereço por CEP (ViaCEP)
- Seletor de UF com modal
- Indicador de status MongoDB (verde/cinza)

### 2️⃣ Lista (`/lista`)
- Paginação (5 usuários por página)
- Busca por nome ou ID
- Pull-to-refresh
- Avatar colorido gerado automaticamente
- Exibição condicional de ID (apenas para admin)

### 3️⃣ Admin (`/admin`)
- Login: `admin` / Senha: `admin123`
- CRUD completo (criar, editar, deletar)
- Modais para criação/edição de usuários
- Busca integrada
- Confirmação antes de deletar

## 🗄️ Bancos de Dados

### SQLite (Local)
- **Arquivo:** `usuarios.db` (criado automaticamente)
- **Tabela:** `usuarios` (12 campos)
- **Seed:** 12 usuários pré-cadastrados na primeira execução

### MongoDB (Sincronização via API)
- **Endpoint:** `http://localhost:3000/api`
- **Collection:** `usuarios`
- **Modo offline:** App funciona sem conexão (salva apenas no SQLite)

## 🎨 Design

### Tema Verde
- Primary: `#2F855A`
- Background: `#F3FFF7`
- Gradientes para botões
- 6 cores de avatar

### Componentes
- LinearGradient para botões
- Ionicons para ícones
- Modal para seleções (UF, edição)
- ScrollView com KeyboardAvoidingView

## 🔧 Tecnologias

- **React Native** (via Expo SDK 54)
- **TypeScript** (app/)
- **JavaScript** (utils/)
- **Expo Router** (navegação file-based)
- **Expo SQLite** (v16.0.10)
- **Expo Linear Gradient** (v14.0.1)
- **Expo Vector Icons** (@expo/vector-icons)
- **React Navigation** (tabs)

## 📦 Scripts

```bash
# Iniciar desenvolvimento
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web

# Limpar cache
npx expo start --clear
```

## 🐛 Troubleshooting

### Erro "No route named cadastro"
Execute uma vez:
```bash
npx expo start --clear
```

### SQLite não inicializa
Verifique se `database.js` está sendo importado em `app/index.tsx`.

### MongoDB sempre offline
- Verifique se o servidor está rodando: `cd ../Server && npm start`
- Teste a URL: `http://localhost:3000/health`
- Ajuste a URL em `src/utils/mongodbService.js` se necessário

### CEP não encontrado
- Verifique conexão com internet
- API: https://viacep.com.br/ws/{cep}/json

---

🚀 **Desenvolvido com React Native + Expo**
