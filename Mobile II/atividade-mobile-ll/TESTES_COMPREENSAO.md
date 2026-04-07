# Testes de Compreensão

## Parte 1: Banco de Dados

**1.** Qual biblioteca é usada para o banco de dados local neste app?
   - a) AsyncStorage
   - b) SQLite (expo-sqlite)
   - c) Firebase
   - d) JSON Files

**2.** Qual é o nome do arquivo de banco de dados criado no dispositivo?

**3.** Por que os parâmetros no SQL usam `?` em vez de concatenar strings diretamente?

**4.** Complete: o método `db.___Async` é usado para buscar múltiplos registros.

**5.** Qual a diferença entre `runAsync` e `getAllAsync` no expo-sqlite?

**5b.** O campo `id` da tabela `usuarios` é do tipo `TEXT` ou `INTEGER`? Como ele é gerado?

---

## Parte 2: Async/Await

**6.** O que acontece se você esquecer o `await` antes de `db.runAsync(...)`?

**7.** Para que serve o bloco `finally` no try/catch/finally?

**8.** Por que a função que chama `await` precisa ser declarada com `async`?

**9.** Qual é o tipo de retorno de uma função `async` em JavaScript?

---

## Parte 3: API ViaCEP

**10.** Qual URL é usada para buscar o CEP `01310100`?

**11.** O que significa `dados.erro` retornar `true` na resposta da ViaCEP?

**12.** Por que o CEP é limpo com `.replace(/\D/g, '')` antes de enviar?

**13.** Qual campo da resposta da ViaCEP armazena o nome da cidade?

---

## Parte 4: React Context

**14.** Para que serve o `AuthContext` neste app?

**15.** O que o hook `useAuth()` retorna?

**16.** Como qualquer tela do app consegue acessar o estado `isAdmin`?

**17.** O que acontece quando `loginAdmin('admin', 'admin123')` é chamado?

---

## Parte 5: Componentes React Native

**18.** Por que `FlatList` é preferida em vez de `ScrollView` para listas longas?

**19.** O que é `ListEmptyComponent` no `FlatList`?

**20.** Para que serve o `useFocusEffect` em `lista.tsx`?

**21.** O que é um `<Modal>` e quando é usado neste app?

**21b.** Como funciona a paginação da lista de usuários? Qual componente exibe os dados de cada página?

**21c.** Por que o campo `ID:` só aparece nos cards quando o admin está logado? Que trecho de código garante isso?

---

## Parte 6: Estrutura do Projeto

**22.** Qual arquivo define as 3 abas de navegação do app?

**23.** Qual é o caminho do arquivo que contém a lógica de CRUD?

**24.** Qual arquivo inicializa a tabela do banco de dados?

**25.** O alias `@/` nos imports aponta para qual pasta?

---

## Gabarito

### Parte 1
1. **b) SQLite (expo-sqlite)**
2. `usuarios.db`
3. Para evitar SQL Injection — parâmetros `?` são escapados automaticamente pelo driver
4. `getAllAsync`
5. `runAsync` executa INSERT/UPDATE/DELETE sem retornar linhas; `getAllAsync` executa SELECT e retorna todos os registros como array
5b. `INTEGER PRIMARY KEY AUTOINCREMENT` — o próprio SQLite gera o valor (1, 2, 3…) sem precisar de código JavaScript

### Parte 2
6. O código continua sem esperar o banco terminar — os dados ainda não estarão disponíveis quando a próxima linha executar
7. O bloco `finally` sempre executa, independente de sucesso ou erro — usado para remover o loading (`setCarregando(false)`)
8. Porque `await` só pode ser usado dentro de funções `async`
9. Sempre retorna uma `Promise`

### Parte 3
10. `https://viacep.com.br/ws/01310100/json/`
11. O CEP não existe na base da ViaCEP
12. Para remover hífens e espaços que o usuário pode digitar (ex: `01310-100` → `01310100`)
13. `localidade`

### Parte 4
14. Compartilhar o estado de autenticação do admin entre todas as telas sem prop drilling
15. `{ isAdmin, loginAdmin, logoutAdmin }`
16. Via `useAuth()` — qualquer componente dentro do `<AuthProvider>` consegue consumir o contexto
17. Valida as credenciais hardcoded, chama `setIsAdmin(true)` e retorna `true`; se errado, retorna `false`

### Parte 5
18. `FlatList` só renderiza os itens visíveis na tela (virtualização), economizando memória e CPU
19. Um componente exibido no lugar da lista quando o array `data` está vazio
20. Para recarregar a lista toda vez que o usuário navega para aquela aba (ao receber foco)
21. Uma janela sobreposta à tela atual. No app é usado para o formulário de criar/editar usuário no admin e para o seletor de UF em ambas as telas
21b. O array completo é fatiado com `.slice()` conforme a página atual (`(pagina-1) * 5` até `pagina * 5`). O `FlatList` recebe apenas esses 5 itens. Os botões ‹ Anterior / Próxima › atualizam o estado `paginaAtual`
21c. A renderização condicional `{isAdmin && <Text>ID: {item.id}</Text>}` garante que o componente só é montado quando `isAdmin` for `true`, obtido via `useAuth()` do `AuthContext`

### Parte 6
22. `app/_layout.tsx`
23. `src/utils/storageService.js`
24. `src/utils/database.js`
25. Para a pasta `src/` (configurado em `tsconfig.json` com `"@/*": ["./src/*"]`)
