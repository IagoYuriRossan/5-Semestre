import * as SQLite from "expo-sqlite";

async function Banco(): Promise<SQLite.SQLiteDatabase | null> {
  try {
    const bd = await SQLite.openDatabaseAsync("FatecV");
    console.log("Banco criado !!!");
    return bd;
  } catch (error) {
    console.log("Erro ao abrir banco:", error);
    return null;
  }
}

async function createTable(db: SQLite.SQLiteDatabase | null) {
  if (!db) { console.log("createTable: DB não disponível"); return; }
  try {
    await db.execAsync(`PRAGMA journal_mode = WAL;`);

    // Cria a tabela com o schema completo (caso não exista)
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS USUARIO(
        ID_US INTEGER PRIMARY KEY AUTOINCREMENT,
        NOME_US VARCHAR(100),
        EMAIL_US VARCHAR(100),
        LOGIN_US VARCHAR(60),
        SENHA_US VARCHAR(100),
        CEP_US VARCHAR(12),
        LOGRADOURO_US VARCHAR(200),
        NUMERO_US VARCHAR(20),
        COMPLEMENTO_US VARCHAR(100),
        UF_US VARCHAR(4),
        CIDADE_US VARCHAR(100),
        ROLE_US VARCHAR(20) DEFAULT 'user'
      )`,
    );

    // Migração: adiciona colunas que podem não existir em bancos antigos
    const tableInfo = await db.getAllAsync("PRAGMA table_info(USUARIO)") as any[];
    const existingCols = tableInfo.map((c: any) => c.name);
    const newCols: [string, string][] = [
      ["LOGIN_US",      "VARCHAR(60)"],
      ["SENHA_US",      "VARCHAR(100)"],
      ["CEP_US",        "VARCHAR(12)"],
      ["LOGRADOURO_US", "VARCHAR(200)"],
      ["NUMERO_US",     "VARCHAR(20)"],
      ["COMPLEMENTO_US","VARCHAR(100)"],
      ["UF_US",         "VARCHAR(4)"],
      ["CIDADE_US",     "VARCHAR(100)"],
      ["ROLE_US",       "VARCHAR(20) DEFAULT 'user'"],
    ];
    for (const [col, type] of newCols) {
      if (!existingCols.includes(col)) {
        await db.execAsync(`ALTER TABLE USUARIO ADD COLUMN ${col} ${type}`);
        console.log(`Coluna ${col} adicionada (migração)`);
      }
    }

    // cria admin padrão se não existir
    const admin = await db.getFirstAsync("SELECT * FROM USUARIO WHERE LOGIN_US = ?", "admin");
    if (!admin) {
      await db.runAsync(
        "INSERT INTO USUARIO(NOME_US, EMAIL_US, LOGIN_US, SENHA_US, ROLE_US) VALUES(?,?,?,?,?)",
        "Administrador",
        "admin@local",
        "admin",
        "admin",
        "admin",
      );
      console.log('Admin padrão criado');
    }

    console.log("Tabela CRIADA!!!");
  } catch (error) {
    console.log("Erro ao criar tabela", error);
  }
}

async function inserirUsuario(
  db: SQLite.SQLiteDatabase,
  nome: string,
  email: string,
  login: string,
  senha: string,
  cep?: string,
  logradouro?: string,
  numero?: string,
  complemento?: string,
  uf?: string,
  cidade?: string,
  role = 'user',
) {
  try {
    await db.runAsync(
      `INSERT INTO USUARIO(NOME_US, EMAIL_US, LOGIN_US, SENHA_US, CEP_US, LOGRADOURO_US, NUMERO_US, COMPLEMENTO_US, UF_US, CIDADE_US, ROLE_US)
       VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
      nome,
      email,
      login,
      senha,
      cep || "",
      logradouro || "",
      numero || "",
      complemento || "",
      uf || "",
      cidade || "",
      role,
    );
    console.log("Usuário inserido com sucesso");
  } catch (error) {
    console.log("Erro ao inserir usuário", error);
  }
}

// listar todos
async function selectUsuarios(db: SQLite.SQLiteDatabase) {
  try {
    const resultado = await db.getAllAsync("SELECT * FROM USUARIO ORDER BY ID_US DESC");
    console.log('Usuários encontrados');
    return resultado;
  } catch (error) {
    console.log("Erro ao buscar usuários", error);
    return [];
  }
}

// paginação
async function selectUsuariosPaginated(db: SQLite.SQLiteDatabase, limit:number, offset:number){
  try {
    const resultado = await db.getAllAsync("SELECT * FROM USUARIO ORDER BY ID_US DESC LIMIT ? OFFSET ?", limit, offset);
    return resultado;
  } catch (error) {
    console.log('Erro na paginação', error);
    return [];
  }
}

// buscar por id
async function selectUsuarioId(db: SQLite.SQLiteDatabase, id: number) {
  try {
    const resultado = await db.getFirstAsync("SELECT * FROM USUARIO WHERE ID_US = ?", id);
    return resultado || null;
  } catch (error) {
    console.log("Erro ao buscar usuário", error);
    return null;
  }
}

// atualizar
async function atualizarUsuario(db: SQLite.SQLiteDatabase, id:number, data: any){
  try {
    await db.runAsync(
      `UPDATE USUARIO SET NOME_US = ?, EMAIL_US = ?, LOGIN_US = ?, SENHA_US = ?, CEP_US = ?, LOGRADOURO_US = ?, NUMERO_US = ?, COMPLEMENTO_US = ?, UF_US = ?, CIDADE_US = ?, ROLE_US = ? WHERE ID_US = ?`,
      data.nome, data.email, data.login, data.senha, data.cep || "", data.logradouro || "", data.numero || "", data.complemento || "", data.uf || "", data.cidade || "", data.role || 'user', id
    );
    console.log('Usuário atualizado');
  } catch (error) {
    console.log('Erro ao atualizar usuário', error);
  }
}

// deletar
async function deletarUsuario(db: SQLite.SQLiteDatabase, id: number) {
  try {
    await db.runAsync("DELETE FROM USUARIO WHERE ID_US = ?", id);
    console.log("Usuário deletado com sucesso");
  } catch (error) {
    console.log("Erro ao deletar usuário", error);
  }
}

// autenticação simples por login+senha
async function autenticarAdmin(db: SQLite.SQLiteDatabase, loginOrEmail: string, senha: string){
  try {
    const res = await db.getFirstAsync("SELECT * FROM USUARIO WHERE (LOGIN_US = ? OR EMAIL_US = ?) AND SENHA_US = ? AND ROLE_US = ?", loginOrEmail, loginOrEmail, senha, 'admin');
    return res || null;
  } catch (error) {
    console.log('Erro autenticar', error);
    return null;
  }
}

export { Banco, createTable, inserirUsuario, selectUsuarios, selectUsuariosPaginated, selectUsuarioId, atualizarUsuario, deletarUsuario, autenticarAdmin };
