# Servidor MongoDB - Atividade Final Mobile II

Servidor intermediário para sincronizar dados do app React Native com MongoDB local.

## 🚀 Como usar

### 1. Instalar dependências
```bash
cd Server
npm install
```

### 2. Iniciar MongoDB Compass
Certifique-se de que o MongoDB está rodando localmente na porta padrão (27017).

### 3. Iniciar o servidor
```bash
npm start
```
Ou com auto-reload:
```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3000`

## 📡 Endpoints

- `POST /api/usuarios` - Criar usuário
- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/:id` - Buscar por ID
- `PUT /api/usuarios/:id` - Atualizar
- `DELETE /api/usuarios/:id` - Deletar
- `GET /health` - Status do servidor

## 🗄️ Database

- Database: `atividadeFinalMobile`
- Collection: `usuarios`
