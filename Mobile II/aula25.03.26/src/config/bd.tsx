import * as SQLite from "expo-sqlite";

async function Banco() {
  const bd = await SQLite.openDatabaseAsync("FatecV");
  console.log("Banco criado !!!");
  return bd;
}

async function createTable(db: SQLite.SQLiteDatabase) {
  try {
    await db.execAsync(
      `PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS USUARIO(
            ID_US INTEGER PRIMARY KEY AUTOINCREMENT,
            NOME_US VARCHAR(100),
            EMAIL_US VARCHAR(100)
            )`,
    );
    console.log("Tabela CRIADA!!!");
  } catch (error) {
    console.log("Erro ao criar tabela", error);
  }
}

async function inserirUsuario(
  db: SQLite.SQLiteDatabase,
  nome: string,
  email: string,
) {
  try {
    await db.runAsync(
      "INSERT INTO USUARIO(NOME_US, EMAIL_US) VALUES(?,?)",
      nome,
      email,
    );
    console.log("Usuário inserido com sucesso");
  } catch (error) {
    console.log("Erro ao inserir usuário", error);
  }
}

// exibir os dados
async function selectUsuarios(db:SQLite.SQLiteDatabase){
  try {
        const resultado = await db.getAllAsync("SELECT * FROM USUARIO");
        console.log(' Usuários encontrados !!!')
        return resultado;
  } catch (error) {
    console.log("Erro ao buscar usuários", error);
    return [];
  }
}

//FILTRO
async function selectUsuarioId(db:SQLite.SQLiteDatabase, id:number) {
  try {
    const resultado = await db.getFirstAsync(" SELECT * FROM USUARIO WHERE ID_US = ?", id);
    console.log('Usuário encontrado!!');
    return resultado;
} catch (error) {
    console.log("Erro ao buscar usuário", error);
  }
}

//DELETAR
async function deletarUsuario(db:SQLite.SQLiteDatabase, id:number) {
  try {
    await db.runAsync("DELETE FROM USUARIO WHERE ID_US = ?", id);
    console
  } catch (error) {
    console.log("Erro ao deletar usuário", error);
  }
}

export { Banco, createTable, inserirUsuario, selectUsuarios, selectUsuarioId, deletarUsuario};
