# Fluxo de Dados — Jornada dos Dados no App

## 1. Cenário: Usuário busca CEP

```
USUÁRIO DIGITA CEP "01310100"
    |
    v
CLICA BOTÃO "Buscar"
    |
    v
handleBuscarCep() é chamada (async)
    |
    v
setBuscandoCep(true) → mostra spinner no botão
    |
    v
buscarEnderecoPorCep("01310100")   [cepService.js]
    |
    v
cep.replace(/\D/g, '') → "01310100" (remove máscara)
    |
    v
fetch("https://viacep.com.br/ws/01310100/json/")
    |  await ← pausa aqui até a resposta chegar
    v
response.json()   ← converte JSON para objeto JS
    |  await
    v
Retorna:
{
  rua: "Avenida Paulista",
  bairro: "Bela Vista",
  cidade: "São Paulo",
  uf: "SP"
}
    |
    v
setRua / setBairro / setCidade / setUf
setCepEncontrado(true)
    |
    v
setBuscandoCep(false) → remove spinner
    |
    v
CAMPOS PREENCHEM NA TELA (editable={false})
```

---

## 2. Cenário: Usuário salva cadastro

```
USUÁRIO CLICA "Criar conta"
    |
    v
Validação:
  - nome, email, senha preenchidos?
  - senha === confirmarSenha ?
  - senha.length >= 6 ?
  - se tem CEP, foi buscado antes?
    |
    v (tudo ok)
setCarregando(true) → desabilita botão
    |
    v
salvarUsuario({ nome, email, senha, ... })   [storageService.js]
    |
    v
getDatabase()   [database.js]
    |
    v
dataCadastro = new Date().toLocaleDateString('pt-BR')
    |
    v
db.runAsync(INSERT INTO usuarios ...)
  └─ o próprio SQLite gera o id (AUTOINCREMENT: 1, 2, 3...)
    |  await
    v
REGISTRO SALVO NO SQLite (usuarios.db)
    |
    v
Alert.alert("Sucesso", "Usuário cadastrado com sucesso!")
    |
    v
Formulário limpo (todos os estados resetados para '')
setCarregando(false)
```

---

## 3. Cenário: Aba Usuários é aberta

```
USUÁRIO TOCA NA ABA "Usuários"
    |
    v
useFocusEffect detecta que a tela ganhou foco
    |
    v
carregarUsuarios() é chamada (async)
    |
    v
setCarregando(true) → exibe ActivityIndicator
    |
    v
obterTodosUsuarios()   [storageService.js]
    |
    v
db.getAllAsync("SELECT * FROM usuarios ORDER BY rowid DESC")
    |  await
    v
Retorna array com todos os usuários (mais recente primeiro)
    |
    v
setUsuarios(lista) → atualiza estado
setPaginaAtual(1)  → volta para página 1
    |
    v
setCarregando(false)
    |
    v
Filtro aplicado pelo termo de busca (nome ou ID)
    |
    v
Slice da página atual (5 itens)
    |
    v
FlatList renderiza os 5 cards da página
Rodapé com botões ‹ Anterior / Próxima › (se > 1 página)
(ID só exibido nos cards se isAdmin === true)
```

---

## 4. Cenário: Admin edita usuário

```
ADMIN CLICA NO ÍCONE ✏️
    |
    v
abrirModalEditar(user) → preenche form com dados do usuário
setModalVisivel(true) → abre Modal
    |
    v
Admin altera campos (pode buscar novo CEP)
    |
    v
CLICA "Salvar"
    |
    v
Validação: nome, email, senha obrigatórios; senha >= 6 chars
    |
    v
atualizarUsuario(editando.id, form)   [storageService.js]
    |
    v
db.runAsync("UPDATE usuarios SET nome=?, email=?, ... WHERE id=?")
    |  await
    v
Alert.alert("Sucesso", "Usuário atualizado!")
fecharModal()
carregarUsuarios() → lista recarrega
```

---

## 5. Cenário: Admin deleta usuário

```
ADMIN CLICA NO ÍCONE 🗑️
    |
    v
Alert.alert("Confirmar exclusão", "Deseja excluir '...'?")
    |
    ├── "Cancelar" → não faz nada
    |
    └── "Excluir" (destructive)
          |
          v
        deletarUsuario(user.id)   [storageService.js]
          |
          v
        db.runAsync("DELETE FROM usuarios WHERE id = ?")
          |  await
          v
        carregarUsuarios() → lista recarrega
          |
          v
        USUÁRIO DESAPARECE DA LISTA
```

---

## 6. Cenário: Login do admin

```
ADMIN ACESSA ABA "Admin"
    |
    v
isAdmin === false → exibe componente <TelaLogin>
    |
    v
Admin digita "admin" e "admin123", clica "Entrar"
    |
    v
setTimeout(400ms) → feedback visual de carregamento
    |
    v
loginAdmin("admin", "admin123")   [AuthContext.tsx]
    |
    v
Compara com ADMIN_USUARIO e ADMIN_SENHA (hardcoded)
    |
    ├── corretas → setIsAdmin(true) → retorna true
    |                  |
    |                  v
    |             isAdmin === true → exibe <PainelAdmin>
    |
    └── erradas  → retorna false → setErro("Usuário ou senha incorretos.")
```

---

## Como async/await funciona

### Sem await (errado — não espera a resposta)

```javascript
function buscar() {
  const response = fetch('https://...'); // não espera!
  const dados = response.json();        // erro: response é uma Promise
  console.log(dados);                   // undefined
}
```

### Com await (correto — pausa até completar)

```javascript
async function buscar() {
  const response = await fetch('https://...'); // ← pausa aqui
  const dados = await response.json();         // ← pausa aqui
  console.log(dados);                          // objeto completo
}
```

---

## Diagrama geral da arquitetura

```
┌─────────────────────────────────────┐
│           TELAS (app/)              │
│  cadastro.tsx  lista.tsx  admin.tsx │
│              _layout.tsx            │
└──────────────┬──────────────────────┘
               │ chama funções de
               ▼
┌─────────────────────────────────────┐
│         SERVIÇOS (src/utils/)       │
│                                     │
│  storageService.js ←→ database.js  │
│       (CRUD)          (SQLite)      │
│                                     │
│  cepService.js ←→ viacep.com.br    │
│    (fetch CEP)      (HTTPS/GET)     │
└──────────────┬──────────────────────┘
               │ estado global via
               ▼
┌─────────────────────────────────────┐
│        CONTEXTO (src/context/)      │
│  AuthContext.tsx                    │
│  isAdmin | loginAdmin | logoutAdmin │
└─────────────────────────────────────┘
```
