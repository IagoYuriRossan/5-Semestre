# Exemplos Práticos — Código Comentado

## Exemplo 1: Busca de CEP com tratamento de erros

```javascript
// src/utils/cepService.js

export const buscarEnderecoPorCep = async (cep) => {
  // Remove tudo que não for número (ex: "01310-100" vira "01310100")
  const cepLimpo = cep.replace(/\D/g, '');

  // Valida o tamanho antes de fazer a requisição
  if (cepLimpo.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos.');
  }

  // Faz a requisição HTTP para a API pública ViaCEP
  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

  // Verifica se a requisição HTTP funcionou (status 200-299)
  if (!response.ok) {
    throw new Error('Não foi possível consultar o CEP. Tente novamente.');
  }

  // Converte a resposta de texto para objeto JavaScript
  const data = await response.json();

  // A API retorna { erro: true } quando o CEP não existe
  if (data.erro) {
    throw new Error('CEP não encontrado.');
  }

  // Retorna apenas os campos que precisamos
  // ?? '' garante string vazia caso o campo venha null/undefined
  return {
    rua: data.logradouro ?? '',
    bairro: data.bairro ?? '',
    cidade: data.localidade ?? '',
    uf: data.uf ?? '',
  };
};
```

---

## Exemplo 2: Salvar usuário no SQLite

```javascript
// src/utils/storageService.js

export const salvarUsuario = async (usuario) => {
  // Pega (ou cria) a conexão com o banco
  const db = await getDatabase();

  // Data de cadastro formatada em pt-BR: "06/04/2026"
  const dataCadastro = new Date().toLocaleDateString('pt-BR');

  // O id NÃO é informado — o SQLite gera automaticamente (INTEGER AUTOINCREMENT)
  // INSERT com parâmetros "?" para evitar SQL Injection
  const result = await db.runAsync(
    `INSERT INTO usuarios
     (nome, email, senha, telefone, cep, rua, numero, bairro, cidade, uf, dataCadastro)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario.nome ?? '',
      usuario.email ?? '',
      usuario.senha ?? '',
      usuario.telefone ?? '',
      usuario.cep ?? '',
      usuario.rua ?? '',
      usuario.numero ?? '',
      usuario.bairro ?? '',
      usuario.cidade ?? '',
      usuario.uf ?? '',
      dataCadastro,
    ]
  );

  // result.lastInsertRowId contém o id gerado (1, 2, 3...)
  return { id: result.lastInsertRowId, ...usuario, dataCadastro };
};
```

  return { id, ...usuario, dataCadastro };
};
```

---

## Exemplo 3: Formulário de cadastro com validação

```typescript
// app/cadastro.tsx (simplificado)

const handleCadastrar = async () => {
  // Validação: campos obrigatórios
  if (!nome.trim() || !email.trim() || !senha.trim()) {
    Alert.alert('Atenção', 'Nome, e-mail e senha são obrigatórios.');
    return; // Sai da função sem salvar
  }

  // Validação: senhas iguais
  if (senha !== confirmarSenha) {
    Alert.alert('Atenção', 'As senhas não coincidem.');
    return;
  }

  // Validação: tamanho mínimo
  if (senha.length < 6) {
    Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  // Validação: CEP foi pesquisado antes de salvar
  if (cep.trim() && !cepEncontrado) {
    Alert.alert('Atenção', 'Clique em "Buscar" para pesquisar o endereço pelo CEP.');
    return;
  }

  setCarregando(true);
  try {
    // Salva no SQLite
    await salvarUsuario({ nome, email, senha, telefone, cep, rua, numero, bairro, cidade, uf });

    Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');

    // Limpa todos os campos após salvar
    setNome(''); setEmail(''); setSenha(''); setConfirmarSenha('');
    setTelefone(''); setCep(''); setNumero('');
    limparEndereco();

  } catch (erro) {
    Alert.alert('Erro', 'Não foi possível cadastrar: ' + (erro as Error).message);
  } finally {
    setCarregando(false); // Sempre remove o loading
  }
};
```

---

## Exemplo 4: Lista com paginação, busca e controle de ID

```typescript
// app/lista.tsx (simplificado)

const ITENS_POR_PAGINA = 5;

// Filtra por nome ou ID conforme o campo de busca
const termo = busca.trim().toLowerCase();
const usuariosFiltrados = termo
  ? usuarios.filter(
      (u) => u.nome.toLowerCase().includes(termo) || u.id.toString().includes(termo)
    )
  : usuarios;

// Fatia apenas os registros da página atual
const totalPaginas = Math.ceil(usuariosFiltrados.length / ITENS_POR_PAGINA);
const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
const usuariosPagina = usuariosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);

return (
  <FlatList
    data={usuariosPagina}                        // Só os 5 da página atual
    keyExtractor={(item) => item.id.toString()}  // ID numérico convertido para string
    renderItem={({ item }) => (
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetra}>
            {item.nome.charAt(0).toUpperCase()}  // Inicial do nome como avatar
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.email}>{item.email}</Text>
          {item.telefone ? <Text>{item.telefone}</Text> : null}
          <Text style={styles.data}>Cadastrado em: {item.dataCadastro}</Text>
          {isAdmin && <Text style={styles.idTexto}>ID: {item.id}</Text>}  // só admin vê
        </View>
      </View>
    )}
    ListHeaderComponent={
      <>
        <TextInput                               // Campo de busca
          placeholder="Buscar por nome ou ID..."
          value={busca}
          onChangeText={(t) => { setBusca(t); setPaginaAtual(1); }}
        />
        <Text>{usuariosFiltrados.length} usuário(s) encontrado(s)</Text>
      </>
    }
    ListFooterComponent={                        // Botões de paginação
      totalPaginas > 1 ? (
        <View style={styles.paginacao}>
          <TouchableOpacity onPress={() => setPaginaAtual((p) => Math.max(1, p - 1))}>
            <Text>‹ Anterior</Text>
          </TouchableOpacity>
          <Text>{paginaAtual} / {totalPaginas}</Text>
          <TouchableOpacity onPress={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}>
            <Text>Próxima ›</Text>
          </TouchableOpacity>
        </View>
      ) : null
    }
    refreshing={carregando}
    onRefresh={carregarUsuarios}
  />
);
```

---

## Exemplo 5: React Context para autenticação

```typescript
// src/context/AuthContext.tsx

const ADMIN_USUARIO = 'admin';
const ADMIN_SENHA   = 'admin123';

// 1. Criar o contexto com valor padrão
const AuthContext = createContext<AuthContextData>({
  isAdmin: false,
  loginAdmin: () => false,
  logoutAdmin: () => {},
});

// 2. Criar o Provider (envolve o app inteiro via _layout.tsx)
export function AuthProvider({ children }: { children: React.ReactNode }) {
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

// 3. Hook para consumir o contexto em qualquer tela
export const useAuth = () => useContext(AuthContext);
```

Nas telas:

```typescript
// app/admin.tsx
const { isAdmin, loginAdmin, logoutAdmin } = useAuth();

// Renderização condicional baseada no estado de autenticação
export default function AdminScreen() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return <TelaLogin />;    // não autenticado
  return <PainelAdmin />;               // autenticado
}
```

---

## Exemplo 6: Modal de seleção de UF

```typescript
// app/cadastro.tsx (simplificado)

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

// Botão que abre o modal (parece um input mas abre lista)
<TouchableOpacity
  style={styles.seletor}
  onPress={() => setModalUfVisivel(true)}
>
  <Text>{uf || 'Selecione a UF'}</Text>
  <Text>▼</Text>
</TouchableOpacity>

// Modal com grade de estados (4 por linha)
<Modal
  visible={modalUfVisivel}
  transparent
  animationType="slide"
  onRequestClose={() => setModalUfVisivel(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <Text>Selecione a UF</Text>
      <FlatList
        data={UFS}
        keyExtractor={(item) => item}
        numColumns={4}                     // Grade de 4 colunas
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            setUf(item);                   // Salva a UF selecionada
            setModalUfVisivel(false);      // Fecha o modal
          }}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  </View>
</Modal>
```

---

## Exemplo 7: useFocusEffect para recarregar dados

```typescript
// app/lista.tsx e app/admin.tsx

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

// Recarrega sempre que a tela ganha foco (ao navegar para ela)
useFocusEffect(
  useCallback(() => {
    carregarUsuarios();
    // Chamado: ao entrar na aba, ao voltar de outra aba
    // NÃO chamado: quando a tela já está visível e o usuário interage com ela
  }, [])
);
```

Sem isso, se você cadastrar um usuário e ir para a aba **Usuários**, a lista não atualizaria.

---

## Exemplo 8: Busca no painel admin

```typescript
// app/admin.tsx

const [busca, setBusca] = useState('');

// Filtra a lista localmente (sem ir ao banco)
const usuariosFiltrados = busca.trim()
  ? usuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(busca.toLowerCase()) ||
        String(u.id).includes(busca.trim())
    )
  : usuarios; // sem filtro: mostra todos

// Campo de busca
<TextInput
  placeholder="Buscar por nome ou ID..."
  value={busca}
  onChangeText={setBusca}
/>

// FlatList usa os usuários filtrados
<FlatList data={usuariosFiltrados} ... />
```
