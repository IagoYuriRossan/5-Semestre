import { getDatabase } from './database';
import { mongodbService } from './mongodbService';

// ─── Funções principais ────────────────────────────────────────

export const salvarUsuario = async (usuario) => {
  const db = await getDatabase();
  const dataCadastro = new Date().toLocaleDateString('pt-BR');

  // Salvar no SQLite
  const result = await db.runAsync(
    `INSERT INTO usuarios (nome, email, senha, telefone, cep, rua, numero, bairro, cidade, uf, dataCadastro)
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

  const usuarioCompleto = { id: result.lastInsertRowId, ...usuario, dataCadastro };

  // Registrar evento CREATE no MongoDB (apenas se backend online)
  if (mongodbService.estaOnline()) {
    mongodbService.registrarCriacao(usuarioCompleto).catch(console.warn);
  }

  return usuarioCompleto;
};

export const obterTodosUsuarios = async () => {
  const db = await getDatabase();
  const usuarios = await db.getAllAsync('SELECT * FROM usuarios ORDER BY rowid DESC');
  
  // NÃO registrar evento READ ao listar todos (apenas em buscas específicas)
  
  return usuarios;
};

export const obterUsuarioPorId = async (id) => {
  const db = await getDatabase();
  const usuario = await db.getFirstAsync('SELECT * FROM usuarios WHERE id = ?', [id]);
  
  // Registrar evento READ apenas se o usuário existir e backend online
  if (usuario && mongodbService.estaOnline()) {
    mongodbService.registrarConsulta([usuario], 'id').catch(console.warn);
  }
  
  return usuario;
};

// Nova função: buscar usuário com filtro (nome, email, etc.)
export const buscarUsuarios = async (filtro) => {
  const db = await getDatabase();
  let query = 'SELECT * FROM usuarios WHERE 1=1';
  const params = [];
  let camposBuscados = [];

  if (filtro.nome) {
    query += ' AND nome LIKE ?';
    params.push(`%${filtro.nome}%`);
    camposBuscados.push('nome');
  }
  
  if (filtro.email) {
    query += ' AND email LIKE ?';
    params.push(`%${filtro.email}%`);
    camposBuscados.push('email');
  }
  
  if (filtro.telefone) {
    query += ' AND telefone LIKE ?';
    params.push(`%${filtro.telefone}%`);
    camposBuscados.push('telefone');
  }
  
  if (filtro.cidade) {
    query += ' AND cidade LIKE ?';
    params.push(`%${filtro.cidade}%`);
    camposBuscados.push('cidade');
  }

  query += ' ORDER BY rowid DESC';
  
  const usuarios = await db.getAllAsync(query, params);
  
  // Registrar evento READ com metadados da busca (apenas se backend online)
  if (usuarios.length > 0 && mongodbService.estaOnline()) {
    mongodbService.registrarConsulta(
      usuarios,
      camposBuscados.join(', ')
    ).catch(console.warn);
  }
  
  return usuarios;
};

export const atualizarUsuario = async (id, dados) => {
  const db = await getDatabase();
  
  // Buscar usuário ANTES da atualização para registrar mudanças
  const usuarioAntes = await db.getFirstAsync('SELECT * FROM usuarios WHERE id = ?', [id]);
  
  // Atualizar no SQLite
  await db.runAsync(
    `UPDATE usuarios SET nome = ?, email = ?, senha = ?, telefone = ?, cep = ?, rua = ?, numero = ?, bairro = ?, cidade = ?, uf = ? WHERE id = ?`,
    [
      dados.nome ?? '',
      dados.email ?? '',
      dados.senha ?? '',
      dados.telefone ?? '',
      dados.cep ?? '',
      dados.rua ?? '',
      dados.numero ?? '',
      dados.bairro ?? '',
      dados.cidade ?? '',
      dados.uf ?? '',
      id,
    ]
  );

  // Buscar usuário DEPOIS da atualização
  const usuarioDepois = await db.getFirstAsync('SELECT * FROM usuarios WHERE id = ?', [id]);
  
  // Registrar evento UPDATE no MongoDB (apenas se backend online)
  if (usuarioAntes && usuarioDepois && mongodbService.estaOnline()) {
    mongodbService.registrarAtualizacao(usuarioAntes, usuarioDepois).catch(console.warn);
  }
};

export const deletarUsuario = async (id) => {
  const db = await getDatabase();
  
  // Buscar usuário antes de deletar para registrar no MongoDB
  const usuario = await db.getFirstAsync('SELECT * FROM usuarios WHERE id = ?', [id]);
  
  // Deletar do SQLite
  await db.runAsync('DELETE FROM usuarios WHERE id = ?', [id]);
  
  // Registrar evento DELETE no MongoDB (apenas se backend online)
  if (usuario && mongodbService.estaOnline()) {
    mongodbService.registrarExclusao(usuario).catch(console.warn);
  }
};

export const popularBancoDados = async () => {
  const usuarios = [
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

  const db = await getDatabase();
  const dataCadastro = new Date().toLocaleDateString('pt-BR');

  for (const u of usuarios) {
    const existe = await db.getFirstAsync('SELECT id FROM usuarios WHERE email = ?', [u.email]);
    if (!existe) {
      await db.runAsync(
        `INSERT INTO usuarios (nome, email, senha, telefone, cep, rua, numero, bairro, cidade, uf, dataCadastro)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.nome, u.email, u.senha, u.telefone, u.cep, u.rua, u.numero, u.bairro, u.cidade, u.uf, dataCadastro]
      );
    }
  }
};

// Sincronizar todos os usuários locais (SQLite) para o backend/MongoDB
export const sincronizarUsuariosParaMongo = async () => {
  try {
    const usuarios = await obterTodosUsuarios();
    for (const u of usuarios) {
      const usuarioCompleto = {
        id: u.id,
        nome: u.nome,
        email: u.email,
        senha: u.senha,
        telefone: u.telefone,
        cep: u.cep,
        rua: u.rua,
        numero: u.numero,
        bairro: u.bairro,
        cidade: u.cidade,
        uf: u.uf,
        dataCadastro: u.dataCadastro
      };

      // Registrar evento de criação no sistema de auditoria (o servidor fará o upsert em `usuarios`)
      await mongodbService.registrarCriacao(usuarioCompleto).catch(err => console.warn('Erro sync user:', err.message || err));
    }
    return { success: true, count: usuarios.length };
  } catch (error) {
    console.warn('Erro ao sincronizar usuários para Mongo:', error.message || error);
    return { success: false, error: error.message || String(error) };
  }
};
