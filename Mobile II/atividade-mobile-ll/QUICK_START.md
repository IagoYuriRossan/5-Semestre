# Quick Start — Como Rodar o Projeto

## Pré-requisitos

Antes de começar, verifique se tem instalado:
- [Node.js](https://nodejs.org) (versão 18 ou superior)
- [Expo Go](https://expo.dev/go) no celular (opcional)

---

## Passo a Passo

### 1. Abrir o terminal

No VS Code, pressione `Ctrl + J` ou vá em `Terminal > Novo Terminal`.

### 2. Entrar na pasta do projeto

```bash
cd "c:\Users\Alunos\Desktop\5-Semestre\Mobile II\atividade-mobile-ll"
```

### 3. Instalar dependências (somente na primeira vez)

```bash
npm install
```

### 4. Iniciar o servidor Expo

```bash
npm start
```

### 5. Escolher a plataforma

Quando o terminal mostrar o QR code e o menu, pressione:

| Tecla | Plataforma |
|-------|------------|
| `a`   | Android (emulador ou Expo Go) |
| `w`   | Web (abre no navegador) |
| `r`   | Recarregar o app |

---

## Testando o App

### Aba Cadastro (➕)
1. Preencha nome, e-mail, telefone, senha e confirme a senha
2. Digite um CEP (ex: `01310100`) e clique em **Buscar**
3. Rua, bairro e cidade preenchem automaticamente via ViaCEP
4. Clique no campo UF para abrir o seletor de estado
5. Preencha o número manualmente
6. Clique em **Criar conta**

### Aba Usuários (👥)
- Lista todos os usuários cadastrados, **5 por página**
- Campo de busca no topo — filtra por **nome** ou **ID** em tempo real
- O ID de cada usuário só é visível quando o **admin estiver logado**
- Navegue entre páginas com os botões **‹ Anterior** e **Próxima ›**
- Puxe para baixo para atualizar (pull-to-refresh)

### Aba Admin (🔐)
1. Na tela de login, use:
   - **Usuário:** `admin`
   - **Senha:** `admin123`
2. No painel, você pode:
   - Ver todos os usuários com busca por nome ou ID
   - Criar novo usuário (botão **+ Novo Usuário**)
   - Editar usuário existente (ícone ✏️)
   - Excluir usuário (ícone 🗑️) — pede confirmação
3. Clique em **Sair** para deslogar

---

## Solução de Problemas

| Problema | Solução |
|----------|---------|
| `npm start` dá erro | Rode `npm install` primeiro |
| O app não abre no Android | Feche e reabra o Expo Go |
| CEP não encontrado | Verifique se tem 8 dígitos e é um CEP válido |
| Banco de dados com erro | Desinstale e reinstale o app no emulador |
