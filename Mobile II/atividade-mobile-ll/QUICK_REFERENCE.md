# Quick Reference — Consulta Rápida

## Credenciais

| Campo   | Valor      |
|---------|------------|
| Usuário | `admin`    |
| Senha   | `admin123` |

---

## Arquivos Principais

| Arquivo | Função |
|---------|--------|
| `app/_layout.tsx` | Navegação em abas + AuthProvider |
| `app/cadastro.tsx` | Tela de cadastro (pública) |
| `app/lista.tsx` | Listagem de usuários (pública) |
| `app/admin.tsx` | Painel CRUD protegido por login |
| `src/context/AuthContext.tsx` | Contexto de autenticação admin |
| `src/utils/database.js` | Inicializa banco SQLite |
| `src/utils/storageService.js` | CRUD no banco |
| `src/utils/cepService.js` | Consulta ViaCEP |
| `src/constants/theme.ts` | Cores e tema visual |

---

## Funções do storageService.js

```javascript
// Salvar novo usuário (ID gerado automaticamente pelo SQLite — AUTOINCREMENT)
await salvarUsuario({ nome, email, senha, telefone, cep, rua, numero, bairro, cidade, uf });

// Listar todos (ordem: mais recente primeiro)
const usuarios = await obterTodosUsuarios();

// Buscar por ID (número inteiro)
const usuario = await obterUsuarioPorId(id);

// Atualizar campos de um usuário existente
await atualizarUsuario(id, { nome, email, senha, telefone, cep, rua, numero, bairro, cidade, uf });

// Deletar permanentemente
await deletarUsuario(id);
```

---

## cepService.js

```javascript
// Retorna { rua, bairro, cidade, uf }
const endereco = await buscarEnderecoPorCep('01310100');
```

Erros lançados:
- `'CEP deve ter 8 dígitos.'` — menos de 8 dígitos após limpar máscara
- `'CEP não encontrado.'` — não existe na base ViaCEP
- `'Não foi possível consultar o CEP. Tente novamente.'` — falha de rede

---

## AuthContext.tsx

```typescript
const { isAdmin, loginAdmin, logoutAdmin } = useAuth();

// Logar — retorna true se credenciais corretas, false caso contrário
const ok = loginAdmin('admin', 'admin123');

// Verificar estado
if (isAdmin) { /* mostra painel */ }

// Deslogar
logoutAdmin();
```

---

## Padrão async/await (usado em todo o app)

```javascript
const minhaFuncao = async () => {
  try {
    setCarregando(true);
    const resultado = await operacaoAssincrona();
    // usar resultado
  } catch (erro) {
    Alert.alert('Erro', erro.message);
  } finally {
    setCarregando(false); // sempre remove o loading
  }
};
```

---

## Componentes React Native usados

| Componente | Uso no app |
|-----------|-----------|
| `<View>` | Container base (div do mobile) |
| `<Text>` | Exibição de texto |
| `<TextInput>` | Campos de formulário |
| `<TouchableOpacity>` | Botões clicáveis |
| `<ScrollView>` | Rolagem no formulário de cadastro |
| `<FlatList>` | Lista de usuários (lista.tsx e admin.tsx) |
| `<Modal>` | Formulário de criar/editar e seletor de UF |
| `<ActivityIndicator>` | Spinner de carregamento |
| `<KeyboardAvoidingView>` | Evita que teclado cubra inputs (login admin) |

---

## Estrutura da tabela SQLite (usuarios.db)

```sql
CREATE TABLE IF NOT EXISTS usuarios (
  id           INTEGER PRIMARY KEY AUTOINCREMENT, -- gerado automaticamente: 1, 2, 3...
  nome         TEXT NOT NULL,
  email        TEXT NOT NULL,
  senha        TEXT NOT NULL,
  telefone     TEXT DEFAULT '',
  cep          TEXT DEFAULT '',
  rua          TEXT DEFAULT '',
  numero       TEXT DEFAULT '',
  bairro       TEXT DEFAULT '',
  cidade       TEXT DEFAULT '',
  uf           TEXT DEFAULT '',
  dataCadastro TEXT DEFAULT ''
);
```

> Na primeira execução o app insere 12 usuários de exemplo automaticamente.

---

## Comandos npm

```bash
npm install       # Instala dependências
npm start         # Inicia Expo (pressione a=Android, w=Web)
npm run android   # Abre apenas no Android
npm run web       # Abre apenas na Web
```

---

## Checklist antes de entregar

- [ ] App abre sem erros
- [ ] 12 usuários seed aparecem na lista na primeira execução
- [ ] Cadastro de usuário funciona
- [ ] Busca de CEP retorna endereço automaticamente
- [ ] Seletor de UF funciona (modal com 27 estados)
- [ ] Lista exibe usuários com paginação (5 por página)
- [ ] Busca por nome ou ID na aba Usuários funciona
- [ ] ID só aparece nos cards quando admin está logado
- [ ] Login admin funciona (`admin` / `admin123`)
- [ ] CRUD no painel admin funciona
- [ ] Exclusão pede confirmação via Alert
- [ ] Busca por nome/ID no painel admin funciona
- [ ] Logout funciona
