const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'atividadeFinalMobile';
let db;
let mongoClient = null;
let isMongoConnected = false; // flag atualizada por ping periódico
let pingInterval = null; // referência ao intervalo de ping
let lastPingSuccessAt = null;
let lastPingFailAt = null;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware que nega acesso se o MongoDB estiver desconectado
function requireMongoConnected(req, res, next) {
  if (!isMongoConnected) {
    return res.status(503).json({
      success: false,
      error: 'MongoDB desconectado. Tente novamente quando o servidor estiver online.'
    });
  }
  return next();
}

// Aplicar proteção nas rotas que exigem Mongo
app.use('/api/eventos', requireMongoConnected);
app.use('/api/usuarios', requireMongoConnected);

// Connect to MongoDB
MongoClient.connect(MONGO_URI)
  .then(client => {
    mongoClient = client;
    db = client.db(DB_NAME);
    isMongoConnected = true;
    lastPingSuccessAt = new Date().toISOString();
    console.log('✅ Conectado ao MongoDB');

    // Ping periódico para monitorar status da conexão
    if (!pingInterval) {
      pingInterval = setInterval(async () => {
        try {
          await db.admin().ping();
          lastPingSuccessAt = new Date().toISOString();
          if (!isMongoConnected) {
            isMongoConnected = true;
            console.log('🔁 Reconectado ao MongoDB');
          }
        } catch (err) {
          lastPingFailAt = new Date().toISOString();
          if (isMongoConnected) {
            isMongoConnected = false;
            console.error('⚠️ MongoDB ping falhou — marcado como disconnected');
          }
        }
      }, 5000);
    }
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no MongoDB:', err && err.message ? err.message : String(err));
    // não encerra o processo; mantemos o servidor no ar para modo offline
    isMongoConnected = false;
    lastPingFailAt = new Date().toISOString();
  });

// ─── ROTAS DE AUDITORIA / EVENTOS ────────────────────────────

// Registrar evento (cadastro, alteracao, exclusao, consulta)
app.post('/api/eventos', async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.status(503).json({ success: false, error: 'MongoDB disconnected' });
    }
    const { acao, userId, userName, campos, buscadoPor, usuarios } = req.body;
    
    // Validação básica
    if (!acao) {
      return res.status(400).json({ 
        success: false, 
        error: 'Campo obrigatório: acao (cadastro, alteracao, exclusao, consulta)' 
      });
    }

    let evento = {
      acao, // "cadastro", "alteracao", "exclusao", "consulta"
      timestamp: new Date()
    };

    // Estrutura específica por tipo de ação
    if (acao === 'consulta') {
      // Evento de consulta - todos os dados dos usuários consultados
      evento.buscadoPor = buscadoPor || 'desconhecido';
      evento.usuarios = usuarios || [];
    } else {
      // Eventos de cadastro, alteracao, exclusao
      if (!userId || !userName) {
        return res.status(400).json({ 
          success: false, 
          error: 'Campos obrigatórios para cadastro/alteracao/exclusao: userId, userName' 
        });
      }
      evento.userId = Number(userId);
      evento.userName = userName;
      evento.campos = campos || [];
    }
    
    const result = await db.collection('eventos').insertOne(evento);

    // Se for cadastro, popular coleção `usuarios` com os campos enviados
    if (acao === 'cadastro') {
      try {
        // converter array de campos em objeto { campo: valor }
        const userDoc = {};
        (evento.campos || []).forEach(c => {
          if (c && c.campo) {
            // em cadastro esperamos objeto { campo, valor }
            userDoc[c.campo] = 'valor' in c ? c.valor : c.depois ?? '';
          }
        });
        // garantir id e nome
        userDoc.userId = evento.userId;
        userDoc.userName = evento.userName;
        userDoc._updatedAt = new Date();

        // upsert por userId para evitar duplicação
        await db.collection('usuarios').updateOne(
          { userId: evento.userId },
          { $set: userDoc },
          { upsert: true }
        );
      } catch (err) {
        console.error('Erro ao popular coleção usuarios:', err);
        // não falhar o endpoint de eventos por causa disso
      }
    }
    
    // Se for alteracao, aplicar atualizações nos campos informados em 'campos'
    if (acao === 'alteracao') {
      try {
        const setObj = {};
        (evento.campos || []).forEach(c => {
          if (c && c.campo) {
            // em alteração esperamos { campo, antes, depois }
            setObj[c.campo] = 'depois' in c ? c.depois : c.valor ?? '';
          }
        });
        if (Object.keys(setObj).length > 0) {
          setObj._updatedAt = new Date();
          await db.collection('usuarios').updateOne(
            { userId: evento.userId },
            { $set: setObj },
            { upsert: false }
          );
        }
      } catch (err) {
        console.error('Erro ao sincronizar alteracao na coleção usuarios:', err);
      }
    }

    // Se for exclusao, remover o documento correspondente na coleção 'usuarios'
    if (acao === 'exclusao') {
      try {
        await db.collection('usuarios').deleteOne({ userId: evento.userId });
      } catch (err) {
        console.error('Erro ao sincronizar exclusao na coleção usuarios:', err);
      }
    }

    res.status(201).json({ 
      success: true, 
      eventId: result.insertedId,
      message: `Evento ${acao} registrado` 
    });
  } catch (error) {
    console.error('Erro ao registrar evento:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ - Obter todos os eventos (com paginação opcional)
app.get('/api/eventos', async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.status(503).json({ success: false, error: 'MongoDB disconnected' });
    }
    const { limit = 100, skip = 0, acao, userId } = req.query;
    
    // Filtros opcionais
    const filter = {};
    if (acao) filter.acao = acao;
    if (userId) filter.userId = Number(userId);
    
    const eventos = await db.collection('eventos')
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .toArray();
    
    const total = await db.collection('eventos').countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: eventos,
      total,
      limit: Number(limit),
      skip: Number(skip)
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ - Obter evento por ID
app.get('/api/eventos/:id', async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.status(503).json({ success: false, error: 'MongoDB disconnected' });
    }
    const { ObjectId } = require('mongodb');
    const evento = await db.collection('eventos').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!evento) {
      return res.status(404).json({ success: false, message: 'Evento não encontrado' });
    }
    
    res.json({ success: true, data: evento });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ - Obter histórico de um usuário específico
app.get('/api/eventos/usuario/:userId', async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.status(503).json({ success: false, error: 'MongoDB disconnected' });
    }
    const eventos = await db.collection('eventos')
      .find({ userId: Number(req.params.userId) })
      .sort({ timestamp: -1 })
      .toArray();
    
    res.json({ success: true, data: eventos, total: eventos.length });
  } catch (error) {
    console.error('Erro ao buscar histórico do usuário:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ - Estatísticas de eventos
app.get('/api/eventos/stats/resumo', async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.status(503).json({ success: false, error: 'MongoDB disconnected' });
    }
    const stats = await db.collection('eventos').aggregate([
      {
        $group: {
          _id: '$acao',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    const total = await db.collection('eventos').countDocuments();
    
    res.json({ 
      success: true, 
      stats,
      total
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Limpar todos os eventos (útil para testes)
app.delete('/api/eventos', async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.status(503).json({ success: false, error: 'MongoDB disconnected' });
    }
    const result = await db.collection('eventos').deleteMany({});
    
    res.json({ 
      success: true, 
      message: `${result.deletedCount} evento(s) deletado(s)`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Erro ao limpar eventos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: isMongoConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    isMongoConnected,
    lastPingSuccessAt,
    lastPingFailAt
  });
});

// Força re-check / tentativa de reconexão imediata com o MongoDB
app.post('/health/recheck', async (req, res) => {
  try {
    // Se já temos 'db', apenas pingar imediatamente
    if (db) {
      await db.admin().ping();
      isMongoConnected = true;
      lastPingSuccessAt = new Date().toISOString();
      return res.json({ success: true, mongodb: 'connected', message: 'Ping OK', lastPingSuccessAt });
    }

    // Caso contrário, tentar conectar de novo
    mongoClient = await MongoClient.connect(MONGO_URI);
    db = mongoClient.db(DB_NAME);
    isMongoConnected = true;

    // Iniciar o ping periódico se ainda não estiver rodando
    if (!pingInterval) {
      pingInterval = setInterval(async () => {
        try {
          await db.admin().ping();
          lastPingSuccessAt = new Date().toISOString();
          if (!isMongoConnected) {
            isMongoConnected = true;
            console.log('🔁 Reconectado ao MongoDB');
          }
        } catch (err) {
          lastPingFailAt = new Date().toISOString();
          if (isMongoConnected) {
            isMongoConnected = false;
            console.error('⚠️ MongoDB ping falhou — marcado como disconnected');
          }
        }
      }, 5000);
    }

    console.log('🔁 Reconectado ao MongoDB via /health/recheck');
    return res.json({ success: true, mongodb: 'connected', message: 'Reconnected' });
  } catch (err) {
    isMongoConnected = false;
    console.error('Recheck falhou:', err);
    return res.status(500).json({ success: false, mongodb: 'disconnected', error: err.message });
  }
});

// SYNC - Receber lista completa de usuários do SQLite e sincronizar com MongoDB
// Faz upsert nos que existem e delete nos que não estão mais na lista
app.post('/api/usuarios/sync', async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.status(503).json({ success: false, error: 'MongoDB disconnected' });
    }
    const { usuarios } = req.body;
    if (!Array.isArray(usuarios)) {
      return res.status(400).json({ success: false, error: 'Campo obrigatório: usuarios (array)' });
    }

    let inserted = 0, updated = 0, deleted = 0;

    // Upsert de cada usuário enviado
    for (const u of usuarios) {
      const userId = Number(u.id);
      const doc = {
        userId,
        nome: u.nome ?? '',
        email: u.email ?? '',
        telefone: u.telefone ?? '',
        cep: u.cep ?? '',
        rua: u.rua ?? '',
        numero: u.numero ?? '',
        bairro: u.bairro ?? '',
        cidade: u.cidade ?? '',
        uf: u.uf ?? '',
        dataCadastro: u.dataCadastro ?? '',
        _updatedAt: new Date(),
      };

      const existing = await db.collection('usuarios').findOne({ userId });
      await db.collection('usuarios').updateOne(
        { userId },
        { $set: doc },
        { upsert: true }
      );
      if (existing) updated++; else inserted++;
    }

    // Deletar do MongoDB usuários que não estão mais no SQLite
    const localIds = usuarios.map(u => Number(u.id));
    if (localIds.length > 0) {
      const result = await db.collection('usuarios').deleteMany({
        userId: { $nin: localIds }
      });
      deleted = result.deletedCount;
    }

    console.log(`🔄 Sync usuários: ${inserted} inseridos, ${updated} atualizados, ${deleted} removidos`);
    res.json({ success: true, inserted, updated, deleted });
  } catch (error) {
    console.error('Erro ao sincronizar usuários:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ - Obter todos os usuários (coleção de usuários copiada dos cadastros)
app.get('/api/usuarios', async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.status(503).json({ success: false, error: 'MongoDB disconnected' });
    }
    const usuarios = await db.collection('usuarios')
      .find({})
      .sort({ userId: 1 })
      .toArray();

    res.json({ success: true, data: usuarios, total: usuarios.length });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${MONGO_URI}/${DB_NAME}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EACCES') {
    console.error(`ERRO: permissão negada ao tentar escutar na porta ${PORT}.`);
    console.error('Tente usar outra porta ou rode o processo com privilégios elevados.');
  } else if (err && err.code === 'EADDRINUSE') {
    console.error(`ERRO: porta ${PORT} já está em uso por outro processo.`);
    console.error('Verifique processos em execução ou escolha outra porta via PORT=xxxx.');
  } else {
    console.error('Erro ao iniciar o servidor:', err);
  }
  process.exit(1);
});
