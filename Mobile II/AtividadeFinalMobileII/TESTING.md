# ✅ Checklist de Teste - Sincronização SQLite + MongoDB

Use este checklist para verificar se tudo está funcionando corretamente.

## 📋 Pré-requisitos

- [ ] MongoDB instalado e rodando (porta 27017)
- [ ] Node.js instalado (v14+)
- [ ] Expo CLI instalado globalmente
- [ ] MongoDB Compass aberto (opcional, para visualizar)

## 🧪 Testes

### 1️⃣ Testar Conexão MongoDB

```bash
cd Server
node test-connection.js
```

**Resultado esperado:**
```
✅ Conectado com sucesso!
📊 Database: atividadeFinalMobile
👥 Usuários cadastrados: 0
✅ Teste concluído com sucesso!
```

---

### 2️⃣ Iniciar Servidor MongoDB

**Terminal 1:**
```bash
cd Server
npm start
```

**Resultado esperado:**
```
✅ Conectado ao MongoDB
🚀 Servidor rodando em http://localhost:3000
📊 MongoDB: mongodb://localhost:27017/atividadeFinalMobile
```

**Verificar health:**
```bash
curl http://localhost:3000/health
```

Deve retornar:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "..."
}
```

---

### 3️⃣ Iniciar App Expo

**Terminal 2:**
```bash
npx expo start
```

Pressione `w` para web ou `a` para Android.

---

### 4️⃣ Testar Cadastro (CREATE)

1. No app, vá em **Cadastro**
2. Verifique o indicador: **"MongoDB Conectado"** (verde)
3. Preencha os dados:
   - Nome: `Teste Silva`
   - Email: `teste@email.com`
   - Senha: `123456` (mínimo 6 caracteres)
   - Confirmar senha: `123456`
4. Clique em **"Criar conta"**

**No MongoDB Compass:**
- Database: `atividadeFinalMobile`
- Collection: `usuarios`
- Deve aparecer 1 documento com o usuário cadastrado ✅

**No Terminal do servidor:**
```
POST /api/usuarios 201 - - ms
```

---

### 5️⃣ Testar Listagem (READ)

1. No app, vá em **Usuários**
2. O usuário "Teste Silva" deve aparecer na lista
3. Confirme que há **12 usuários pré-cadastrados** (seed)

---

### 6️⃣ Testar Edição (UPDATE)

1. No app, vá em **Admin**
2. Login: `admin` / Senha: `admin123`
3. Clique no ícone de **editar** (lápis) do usuário "Teste Silva"
4. Altere o nome para: `Teste Atualizado`
5. Clique em **"Salvar"**

**No MongoDB Compass:**
- Atualize a collection (F5)
- O nome deve estar atualizado para "Teste Atualizado" ✅

**No Terminal do servidor:**
```
PUT /api/usuarios/:id 200 - - ms
```

---

### 7️⃣ Testar Exclusão (DELETE)

1. No painel Admin
2. Clique no ícone de **deletar** (lixeira) do usuário "Teste Atualizado"
3. Confirme a exclusão

**No MongoDB Compass:**
- Atualize a collection (F5)
- O usuário deve ter sido removido ✅

**No Terminal do servidor:**
```
DELETE /api/usuarios/:id 200 - - ms
```

---

### 8️⃣ Testar Modo Offline

1. **Pare o servidor MongoDB** (Ctrl+C no Terminal 1)
2. No app, vá em **Cadastro**
3. Verifique o indicador: **"MongoDB Offline"** (cinza)
4. Cadastre um novo usuário:
   - Nome: `Offline User`
   - Email: `offline@email.com`
   - Senha: `123456`
5. Clique em **"Criar conta"**

**Resultado:**
- ✅ Usuário salvo no SQLite (local)
- ⚠️ Não sincronizado com MongoDB (esperado)
- ℹ️ No console deve aparecer: `MongoDB indisponível`

6. Vá em **Usuários** → "Offline User" deve aparecer na lista
7. **Reinicie o servidor MongoDB** (`npm start`)
8. Aguarde 10 segundos (auto-verificação)
9. O indicador deve voltar para: **"MongoDB Conectado"** ✅

---

## 🎯 Resultado Final

Se todos os testes passaram:

✅ SQLite funcionando (dados locais)  
✅ MongoDB funcionando (sincronização)  
✅ API REST funcionando (porta 3000)  
✅ Sincronização CREATE/UPDATE/DELETE  
✅ Modo offline funcionando  
✅ Indicador de status visual  

**Parabéns! 🎉 O sistema de dual-database está 100% funcional!**

---

## 📊 Verificação Manual no MongoDB Compass

1. Abra MongoDB Compass
2. Conecte: `mongodb://localhost:27017`
3. Database: `atividadeFinalMobile`
4. Collection: `usuarios`
5. Você deve ver todos os usuários cadastrados

Exemplo de documento:
```json
{
  "_id": ObjectId("..."),
  "id": 13,
  "nome": "Teste Silva",
  "email": "teste@email.com",
  "senha": "123456",
  "telefone": "(11) 99999-9999",
  "cep": "01310-100",
  "rua": "Avenida Paulista",
  "numero": "1000",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "uf": "SP",
  "dataCadastro": "12/05/2026",
  "createdAt": ISODate("2026-05-12T22:30:00.000Z")
}
```

---

## 🐛 Problemas Comuns

### Indicador sempre "Offline"
- Verifique se o servidor está rodando: `curl http://localhost:3000/health`
- Verifique URL em `src/utils/mongodbService.js`

### Dados não aparecem no MongoDB
- Recarregue a collection (F5 no Compass)
- Verifique logs do servidor Node.js
- Teste: `curl http://localhost:3000/api/usuarios`

### App não inicia
```bash
# Limpar cache e reinstalar
rm -rf node_modules
npm install
npx expo start --clear
```

---

**Dúvidas?** Consulte [MONGODB-SETUP.md](./MONGODB-SETUP.md) para instruções detalhadas.
