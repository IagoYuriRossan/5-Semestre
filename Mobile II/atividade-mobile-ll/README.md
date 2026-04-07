# MeuApp — Cadastro de Usuários (React Native + Expo)

Aplicativo mobile para cadastro e gerenciamento de usuários, com busca de endereço por CEP e painel administrativo com CRUD completo.

---

## Funcionalidades

- Cadastro de usuários com nome, e-mail, senha, telefone e endereço completo
- Busca automática de endereço pelo CEP (API ViaCEP)
- Seleção de UF por modal com lista de todos os 27 estados
- Listagem de usuários com busca por nome ou ID e paginação (5 por página)
- ID do usuário visível na lista apenas quando o admin estiver logado
- 12 usuários de exemplo inseridos automaticamente na primeira execução
- Painel admin protegido por login com CRUD completo (criar, visualizar, editar, excluir)
- Pesquisa de usuários por nome ou ID no painel admin
- Banco de dados local com SQLite (expo-sqlite) — IDs autoincrement (1, 2, 3...)

---

## Como executar

```bash
# 1. Entrar na pasta do projeto
cd "c:\Users\Alunos\Desktop\5-Semestre\Mobile II\atividade-mobile-ll"

# 2. Instalar dependências (apenas na primeira vez)
npm install

# 3. Iniciar o servidor Expo
npm start
```

Após iniciar, pressione:
- **a** → Android (emulador ou Expo Go)
- **w** → Web (abre no navegador)
- **i** → iOS (somente Mac)

---

## Estrutura do Projeto

```
app/
├── _layout.tsx          # Navegação em abas (3 abas) + AuthProvider
├── cadastro.tsx         # Tela de cadastro de usuários (pública)
├── lista.tsx            # Listagem de usuários (pública)
└── admin.tsx            # Painel admin com CRUD completo (protegido)

src/
├── context/
│   └── AuthContext.tsx  # Contexto de autenticação do admin
├── constants/
│   └── theme.ts         # Cores e tema visual
└── utils/
    ├── database.js      # Inicialização do banco SQLite
    ├── storageService.js# Operações CRUD no banco (salvar, listar, atualizar, deletar)
    └── cepService.js    # Consulta de endereço pela API ViaCEP
```

---

## Credenciais do Admin

| Campo   | Valor      |
|---------|------------|
| Usuário | `admin`    |
| Senha   | `admin123` |

---

## Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| React Native + Expo ~54 | Base do app mobile |
| expo-router ~6 | Navegação por abas (arquivo-based) |
| expo-sqlite ~16 | Banco de dados local SQLite |
| fetch API (nativo) | Requisições HTTP para a ViaCEP |
| React Context API | Estado global de autenticação do admin |
| TypeScript | Tipagem estática nas telas e no contexto |
