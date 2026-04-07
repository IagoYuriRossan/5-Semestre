# Explicação Detalhada — Como o App Funciona

## 1. Estrutura de Navegação (expo-router)

O arquivo `app/_layout.tsx` define as 3 abas do app usando `<Tabs>` do expo-router.
Cada arquivo dentro de `app/` é automaticamente uma rota — o nome do arquivo vira o nome da aba.

```typescript
// app/_layout.tsx
<AuthProvider>
  <Tabs>
    <Tabs.Screen name="cadastro" options={{ title: 'Cadastrar Usuário' }} />
    <Tabs.Screen name="lista"    options={{ title: 'Usuários Cadastrados' }} />
    <Tabs.Screen name="admin"    options={{ title: 'Painel Administrativo' }} />
  </Tabs>
</AuthProvider>
```

O `<AuthProvider>` envolve tudo para que qualquer tela possa verificar se está logado como admin.

---

## 2. Banco de Dados (SQLite)

O app usa **expo-sqlite** para armazenar dados localmente no dispositivo.
O banco é inicializado uma única vez em `database.js`.

```javascript
// src/utils/database.js
let dbInstance = null;

export const getDatabase = async () => {
  if (dbInstance) return dbInstance; // reutiliza conexão existente

  const db = await SQLite.openDatabaseAsync('usuarios.db');
  await db.execAsync('PRAGMA journal_mode = WAL;'); // melhor performance

  // Migração automática: detecta schema antigo e recria com AUTOINCREMENT
  const info = await db.getFirstAsync(
    `SELECT sql FROM sqlite_master WHERE type='table' AND name='usuarios'`
  );
  if (info && info.sql && info.sql.includes('id TEXT')) {
    await db.execAsync('DROP TABLE IF EXISTS usuarios;');
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,  -- 1, 2, 3...
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
  `);

  // Insere 12 usuários de exemplo se o e-mail ainda não existir
  for (const u of SEED_USUARIOS) {
    const existe = await db.getFirstAsync('SELECT id FROM usuarios WHERE email = ?', [u.email]);
    if (!existe) {
      await db.runAsync(
        `INSERT INTO usuarios (nome, email, senha, ...) VALUES (?, ?, ?, ...)`,
        [u.nome, u.email, u.senha, ...]
      );
    }
  }

  dbInstance = db;
  return db;
};
```

O `INTEGER PRIMARY KEY AUTOINCREMENT` faz o SQLite atribuir IDs sequenciais (1, 2, 3…) automaticamente, sem precisar gerar o valor no JavaScript.

---

## 3. CRUD no storageService.js

O arquivo `storageService.js` contém todas as operações de banco:

### Salvar

```javascript
export const salvarUsuario = async (usuario) => {
  const db = await getDatabase();
  const dataCadastro = new Date().toLocaleDateString('pt-BR');

  // O id NÃO é informado — o SQLite gera automaticamente (AUTOINCREMENT)
  const result = await db.runAsync(
    `INSERT INTO usuarios (nome, email, senha, ...) VALUES (?, ?, ?, ...)`,
    [usuario.nome, usuario.email, usuario.senha, ...]
  );

  return { id: result.lastInsertRowId, ...usuario, dataCadastro };
};
```

Os `?` são parâmetros protegidos contra SQL Injection.

### Listar todos

```javascript
export const obterTodosUsuarios = async () => {
  const db = await getDatabase();
  return await db.getAllAsync('SELECT * FROM usuarios ORDER BY rowid DESC');
};
```

### Atualizar

```javascript
export const atualizarUsuario = async (id, dados) => {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE usuarios SET nome = ?, email = ?, ... WHERE id = ?',
    [dados.nome, dados.email, ..., id]
  );
};
```

### Deletar

```javascript
export const deletarUsuario = async (id) => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM usuarios WHERE id = ?', [id]);
};
```

---

## 4. Busca de CEP (cepService.js)

A API **ViaCEP** é pública e gratuita. Basta fazer um GET com o CEP:

```javascript
// src/utils/cepService.js
export const buscarEnderecoPorCep = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, ''); // remove traço, espaços, etc.

  if (cepLimpo.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

  if (!response.ok) {
    throw new Error('Não foi possível consultar o CEP. Tente novamente.');
  }

  const data = await response.json();

  if (data.erro) {
    throw new Error('CEP não encontrado.');
  }

  return {
    rua: data.logradouro ?? '',
    bairro: data.bairro ?? '',
    cidade: data.localidade ?? '',
    uf: data.uf ?? '',
  };
};
```

A função usa `fetch` (nativo do JavaScript) com `async/await` para aguardar a resposta da rede.

---

## 5. Autenticação do Admin (AuthContext)

O app usa **React Context** para compartilhar o estado de autenticação entre telas sem precisar passar props.

```typescript
// src/context/AuthContext.tsx
const ADMIN_USUARIO = 'admin';
const ADMIN_SENHA   = 'admin123';

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const loginAdmin = (usuario: string, senha: string): boolean => {
    if (usuario === ADMIN_USUARIO && senha === ADMIN_SENHA) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdmin(false);

  return (
    <AuthContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

Na tela admin:

```typescript
// app/admin.tsx
const { isAdmin } = useAuth();

// Se não está autenticado, mostra o formulário de login
if (!isAdmin) return <TelaLogin />;

// Se está autenticado, mostra o painel completo
return <PainelAdmin />;
```

---

## 6. Tela de Cadastro

O formulário usa vários `useState` para cada campo.
O CEP dispara uma função async ao clicar no botão **Buscar**:

```typescript
// app/cadastro.tsx
const handleBuscarCep = async () => {
  setBuscandoCep(true);
  limparEndereco(); // limpa campos antigos antes de buscar
  try {
    const endereco = await buscarEnderecoPorCep(cep);
    setRua(endereco.rua);
    setBairro(endereco.bairro);
    setCidade(endereco.cidade);
    setUf(endereco.uf);
    setCepEncontrado(true);
  } catch (erro) {
    Alert.alert('Erro', (erro as Error).message);
  } finally {
    setBuscandoCep(false);
  }
};
```

O seletor de UF é um `<Modal>` com uma `<FlatList>` dos 27 estados em grade de 4 colunas.
Os campos de rua, bairro e cidade têm `editable={false}` — só são preenchidos pela busca de CEP.

---

## 7. useFocusEffect

Para recarregar a lista toda vez que o usuário navega para a tela, usamos `useFocusEffect`:

```javascript
// lista.tsx e admin.tsx
useFocusEffect(
  useCallback(() => {
    carregarUsuarios(); // chamado sempre que a tela ganha foco
  }, [])
);
```

Sem isso, a lista mostraria dados antigos ao voltar depois de cadastrar um novo usuário.

---

## 8. FlatList vs ScrollView

| Componente | Quando usar |
|-----------|------------|
| `ScrollView` | Conteúdo fixo, poucos elementos (formulário de cadastro) |
| `FlatList` | Lista dinâmica, potencialmente longa (lista de usuários) |

O app usa `FlatList` para listas de usuários porque ela é otimizada: só renderiza os itens visíveis na tela, economizando memória.

---

## 9. try/catch/finally

Todas as operações assíncronas usam o padrão try/catch:

```javascript
try {
  // Tenta executar
  const dados = await operacao();
  // usa os dados...

} catch (erro) {
  // Se der qualquer erro, vem pra cá
  Alert.alert('Erro', erro.message);

} finally {
  // Sempre executa (sucesso ou erro)
  setCarregando(false); // garante que o loading some
}
```

O `finally` garante que o spinner de carregamento sempre desaparece, mesmo em caso de erro.

---

## 10. Paginação e Busca na Lista de Usuários

A tela `lista.tsx` carrega todos os usuários do banco e aplica filtro e paginação **no lado do cliente** (sem queries adicionais ao banco):

```typescript
const ITENS_POR_PAGINA = 5;

// 1. Filtra por nome ou ID conforme o texto digitado
const termo = busca.trim().toLowerCase();
const usuariosFiltrados = termo
  ? usuarios.filter(
      (u) => u.nome.toLowerCase().includes(termo) || u.id.toString().includes(termo)
    )
  : usuarios;

// 2. Calcula a fatia da página atual
const totalPaginas = Math.ceil(usuariosFiltrados.length / ITENS_POR_PAGINA);
const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
const usuariosPagina = usuariosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
```

O `FlatList` recebe `usuariosPagina` (só os 5 da página atual). Os botões **‹ Anterior** e **Próxima ›** incrementam/decrementam `paginaAtual`.

### ID visível apenas para admin

O campo `ID:` no card só é renderizado quando o admin estiver autenticado:

```typescript
{isAdmin && <Text style={styles.idTexto}>ID: {item.id}</Text>}
```
