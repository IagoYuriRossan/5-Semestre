import * as SQLite from 'expo-sqlite';

let dbInstance = null;

const SEED_USUARIOS = [
  { nome: 'Ana Souza', email: 'ana.souza@email.com', senha: 'senha123', telefone: '(11) 98765-4321', cep: '01310-100', rua: 'Avenida Paulista', numero: '1000', bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP' },
  { nome: 'Carlos Ferreira', email: 'carlos.ferreira@email.com', senha: 'senha123', telefone: '(21) 97654-3210', cep: '20040-020', rua: 'Avenida Rio Branco', numero: '45', bairro: 'Centro', cidade: 'Rio de Janeiro', uf: 'RJ' },
  { nome: 'Mariana Lima', email: 'mariana.lima@email.com', senha: 'senha123', telefone: '(31) 96543-2109', cep: '30130-010', rua: 'Rua Espírito Santo', numero: '200', bairro: 'Centro', cidade: 'Belo Horizonte', uf: 'MG' },
  { nome: 'Pedro Oliveira', email: 'pedro.oliveira@email.com', senha: 'senha123', telefone: '(41) 95432-1098', cep: '80010-010', rua: 'Rua XV de Novembro', numero: '700', bairro: 'Centro', cidade: 'Curitiba', uf: 'PR' },
  { nome: 'Juliana Costa', email: 'juliana.costa@email.com', senha: 'senha123', telefone: '(51) 94321-0987', cep: '90010-150', rua: 'Rua Siqueira Campos', numero: '1234', bairro: 'Centro Histórico', cidade: 'Porto Alegre', uf: 'RS' },
  { nome: 'Roberto Santos', email: 'roberto.santos@email.com', senha: 'senha123', telefone: '(71) 93210-9876', cep: '40020-010', rua: 'Rua Chile', numero: '5', bairro: 'Centro', cidade: 'Salvador', uf: 'BA' },
  { nome: 'Fernanda Alves', email: 'fernanda.alves@email.com', senha: 'senha123', telefone: '(85) 92109-8765', cep: '60135-222', rua: 'Avenida Beira Mar', numero: '3300', bairro: 'Meireles', cidade: 'Fortaleza', uf: 'CE' },
  { nome: 'Lucas Mendes', email: 'lucas.mendes@email.com', senha: 'senha123', telefone: '(91) 91098-7654', cep: '66010-090', rua: 'Avenida Presidente Vargas', numero: '800', bairro: 'Campina', cidade: 'Belém', uf: 'PA' },
  { nome: 'Beatriz Rocha', email: 'beatriz.rocha@email.com', senha: 'senha123', telefone: '(62) 90987-6543', cep: '74030-010', rua: 'Avenida Goiás', numero: '215', bairro: 'Centro', cidade: 'Goiânia', uf: 'GO' },
  { nome: 'Thiago Cardoso', email: 'thiago.cardoso@email.com', senha: 'senha123', telefone: '(67) 99876-5432', cep: '79002-020', rua: 'Avenida Afonso Pena', numero: '3456', bairro: 'Centro', cidade: 'Campo Grande', uf: 'MS' },
  { nome: 'Camila Ribeiro', email: 'camila.ribeiro@email.com', senha: 'senha123', telefone: '(82) 98765-1234', cep: '57020-050', rua: 'Rua do Comércio', numero: '120', bairro: 'Centro', cidade: 'Maceió', uf: 'AL' },
  { nome: 'Diego Nascimento', email: 'diego.nascimento@email.com', senha: 'senha123', telefone: '(98) 97654-2345', cep: '65010-050', rua: 'Rua Grande', numero: '567', bairro: 'Centro', cidade: 'São Luís', uf: 'MA' },
];

export const getDatabase = async () => {
  if (dbInstance) return dbInstance;

  const db = await SQLite.openDatabaseAsync('usuarios.db');

  await db.execAsync('PRAGMA journal_mode = WAL;');

  const info = await db.getFirstAsync(
    `SELECT sql FROM sqlite_master WHERE type='table' AND name='usuarios'`
  );
  if (info && info.sql && info.sql.includes('id TEXT')) {
    await db.execAsync('DROP TABLE IF EXISTS usuarios;');
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      senha TEXT NOT NULL,
      telefone TEXT DEFAULT '',
      cep TEXT DEFAULT '',
      rua TEXT DEFAULT '',
      numero TEXT DEFAULT '',
      bairro TEXT DEFAULT '',
      cidade TEXT DEFAULT '',
      uf TEXT DEFAULT '',
      dataCadastro TEXT DEFAULT ''
    );
  `);

  
  const dataCadastro = new Date().toLocaleDateString('pt-BR');
  for (const u of SEED_USUARIOS) {
    const existe = await db.getFirstAsync('SELECT id FROM usuarios WHERE email = ?', [u.email]);
    if (!existe) {
      await db.runAsync(
        `INSERT INTO usuarios (nome, email, senha, telefone, cep, rua, numero, bairro, cidade, uf, dataCadastro)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.nome, u.email, u.senha, u.telefone, u.cep, u.rua, u.numero, u.bairro, u.cidade, u.uf, dataCadastro]
      );
    }
  }

  dbInstance = db;
  return db;
};
