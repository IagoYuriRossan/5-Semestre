# Resumo para o Professor

## O que foi desenvolvido

Aplicativo mobile completo em **React Native + Expo** com:

1. **Cadastro de usuários** — formulário com dados pessoais e busca de endereço automática por CEP
2. **Listagem de usuários** — FlatList com pull-to-refresh exibindo todos os cadastrados
3. **Painel administrativo** — CRUD completo protegido por autenticação via React Context

---

## Telas

### 1. Cadastro (pública)
- Campos: nome, e-mail, telefone, senha (com confirmação mínimo 6 caracteres)
- Campo CEP com botão **Buscar** — preenche rua, bairro, cidade automaticamente via API ViaCEP
- Seleção de UF por modal com `FlatList` dos 27 estados
- Número preenchido manualmente
- Validações: campos obrigatórios, senhas iguais, mínimo de caracteres, CEP buscado antes de salvar

### 2. Usuários (pública)
- Lista todos os usuários com avatar (inicial do nome), nome, e-mail, telefone e data de cadastro
- **Campo de busca** por nome ou ID em tempo real
- **Paginação** de 5 usuários por página com botões ‹ Anterior / Próxima ›
- ID de cada usuário exibido nos cards **somente quando o admin estiver logado**
- Atualiza automaticamente ao focar na tela (`useFocusEffect`)
- 12 usuários de exemplo inseridos automaticamente na primeira execução

### 3. Admin (protegida)
- Tela de login com usuário e senha (`admin` / `admin123`)
- Após login: listagem com busca por nome ou ID
- Botão para criar novo usuário com formulário em modal (+ busca de CEP + seletor de UF)
- Edição em modal pré-preenchido com os dados do usuário
- Exclusão com confirmação via `Alert.alert`
- Botão **Sair** para logout

---

## Tecnologias utilizadas

| Tecnologia | Versão | Finalidade |
|-----------|--------|-----------|
| React Native | 0.79 | Base mobile |
| Expo | ~54.0.33 | Build e ferramentas |
| expo-router | ~6.0.23 | Navegação por abas (arquivo-based) |
| expo-sqlite | ~16.0.10 | Banco de dados local SQLite |
| fetch API | nativo | Requisição HTTP (ViaCEP) |
| React Context | nativo | Estado global de autenticação |
| TypeScript | strict | Tipagem estática em `app/` e `src/context/` |

---

## Conceitos demonstrados

| Conceito | Onde aparece |
|----------|-------------|
| Async/Await | Todas as funções de banco e CEP |
| try/catch/finally | `storageService.js`, `cepService.js`, todas as telas |
| React Context API | `AuthContext.tsx` + `useAuth()` em `admin.tsx` e `lista.tsx` |
| SQLite com expo-sqlite | `database.js` + `storageService.js` |
| INTEGER AUTOINCREMENT | `database.js` — IDs gerados pelo próprio banco (1, 2, 3…) |
| Seed automático | `database.js` — 12 usuários inseridos na primeira execução |
| fetch + API REST | `cepService.js` (ViaCEP) |
| useFocusEffect | `lista.tsx`, `admin.tsx` |
| FlatList | `lista.tsx`, `admin.tsx`, modal de UF |
| Paginação client-side | `lista.tsx` — slice do array conforme página atual |
| Busca por nome ou ID | `lista.tsx` e `admin.tsx` |
| Renderização condicional por perfil | `lista.tsx` — ID visível só para admin |
| Modal | `admin.tsx` (formulário + UF), `cadastro.tsx` (UF) |
| useState | Extensivamente em todas as telas |
| Parâmetros SQL preparados (?) | `storageService.js` — previne SQL Injection |

---

## Como demonstrar

1. Iniciar com `npm start` e pressionar `a` ou `w`
2. Ir para **Usuários** — ver os 12 usuários seed e a paginação (5 por página)
3. Digitar um nome no campo de busca e mostrar o filtro em tempo real
4. Ir para **Cadastro**, preencher os dados e buscar um CEP real (ex: `01310100`)
5. Voltar para **Usuários** e ver o novo cadastro na lista
6. Ir para **Admin**, fazer login com `admin` / `admin123`
7. Mostrar que o ID passa a aparecer nos cards da aba Usuários
8. Editar um usuário (✏️), alterar um campo e salvar
9. Excluir um usuário (🗑️) e confirmar a exclusão no Alert

---

## Estrutura de arquivos

```
app/                     # Telas (expo-router)
  _layout.tsx            # Layout de abas + AuthProvider
  cadastro.tsx           # Tela de cadastro
  lista.tsx              # Listagem de usuários
  admin.tsx              # Painel admin com CRUD

src/
  context/
    AuthContext.tsx      # Contexto de autenticação (isAdmin, login, logout)
  constants/
    theme.ts             # Cores do tema
  utils/
    database.js          # Inicializa banco SQLite (usuarios.db)
    storageService.js    # CRUD: salvar, listar, buscar, atualizar, deletar
    cepService.js        # Busca de endereço por CEP via ViaCEP
```
