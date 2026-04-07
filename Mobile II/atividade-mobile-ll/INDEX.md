# Índice de Documentação

## Guia de Leitura Recomendado

### "Quero rodar o app rápido"
1. [QUICK_START.md](QUICK_START.md) — instalar e executar
2. Teste as 3 abas: Cadastro, Usuários, Admin

---

### "Quero entender o código"
1. [README.md](README.md) — visão geral do projeto
2. [EXPLICACAO_DETALHADA.md](EXPLICACAO_DETALHADA.md) — conceitos e arquitetura
3. [FLUXO_DADOS.md](FLUXO_DADOS.md) — como os dados circulam
4. [EXEMPLOS_PRATICOS.md](EXEMPLOS_PRATICOS.md) — exemplos de código comentados
5. [TESTES_COMPREENSAO.md](TESTES_COMPREENSAO.md) — perguntas para fixar o conteúdo

---

### "Sou o professor"
1. [RESUMO_PROFESSOR.md](RESUMO_PROFESSOR.md) — visão rápida do que foi entregue
2. [QUICK_START.md](QUICK_START.md) — como rodar
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) — referência rápida de arquivos e funções

---

## Arquivos de Código

| Arquivo | Descrição |
|---------|-----------|
| `app/_layout.tsx` | Navegação em abas (3 abas) + AuthProvider |
| `app/cadastro.tsx` | Tela de cadastro de usuários (pública) |
| `app/lista.tsx` | Listagem de todos os usuários |
| `app/admin.tsx` | Painel admin com CRUD completo |
| `src/context/AuthContext.tsx` | Contexto de autenticação do admin |
| `src/utils/database.js` | Inicialização do banco SQLite |
| `src/utils/storageService.js` | Operações CRUD no banco |
| `src/utils/cepService.js` | Consulta de endereço via ViaCEP |
| `src/constants/theme.ts` | Cores e tema visual |

---

## Arquivos de Documentação

| Arquivo | O que contém | Tempo |
|---------|-------------|-------|
| [README.md](README.md) | Visão geral, estrutura, tecnologias | 5 min |
| [COMECE_AQUI.md](COMECE_AQUI.md) | Ponto de entrada, por onde começar | 2 min |
| [QUICK_START.md](QUICK_START.md) | Passo a passo para rodar o app | 5 min |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Consulta rápida de funções e componentes | consulta |
| [EXPLICACAO_DETALHADA.md](EXPLICACAO_DETALHADA.md) | Como cada parte do código funciona | 20 min |
| [FLUXO_DADOS.md](FLUXO_DADOS.md) | Jornada dos dados no app (diagramas) | 10 min |
| [EXEMPLOS_PRATICOS.md](EXEMPLOS_PRATICOS.md) | Exemplos de código comentados | 15 min |
| [TESTES_COMPREENSAO.md](TESTES_COMPREENSAO.md) | 25 perguntas com gabarito | 10 min |
| [RESUMO_PROFESSOR.md](RESUMO_PROFESSOR.md) | Resumo executivo para avaliação | 5 min |

---

## Estrutura do Projeto

```
app/
├── _layout.tsx          # Navegação em abas + AuthProvider
├── cadastro.tsx         # Tela de cadastro (pública)
├── lista.tsx            # Listagem de usuários (pública)
└── admin.tsx            # Painel admin (protegido)

src/
├── context/
│   └── AuthContext.tsx  # isAdmin, loginAdmin, logoutAdmin
├── constants/
│   └── theme.ts         # Cores do tema
└── utils/
    ├── database.js      # Abre banco SQLite e cria tabela
    ├── storageService.js# CRUD: salvar, listar, buscar, atualizar, deletar
    └── cepService.js    # fetch → ViaCEP → { rua, bairro, cidade, uf }
```

---

## Checklist de Leitura

### Mínimo (para rodar)
- [ ] README.md
- [ ] QUICK_START.md
- [ ] Rodar o app

### Recomendado (entender bem)
- [ ] EXPLICACAO_DETALHADA.md
- [ ] FLUXO_DADOS.md
- [ ] EXEMPLOS_PRATICOS.md
- [ ] Explorar o código

### Completo (dominar)
- [ ] Todos acima
- [ ] TESTES_COMPREENSAO.md
- [ ] Modificar e experimentar código

---

## O que você aprenderá

- Como usar `async/await` e quando é necessário
- Como a `fetch API` faz requisições HTTP
- Como o SQLite armazena dados localmente no dispositivo
- Como o `try/catch/finally` garante robustez no código
- Como o React Context compartilha estado entre telas
- Como estruturar um app React Native com expo-router
