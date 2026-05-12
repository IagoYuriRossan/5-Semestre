const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'atividadeFinalMobile';
let db;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    console.log('✅ Conectado ao MongoDB');
    db = client.db(DB_NAME);
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no MongoDB:', err);
    process.exit(1);
  });

// ─── ROTAS ────────────────────────────────────────────────────

// CREATE - Salvar usuário
app.post('/api/usuarios', async (req, res) => {
  try {
    const usuario = {
      ...req.body,
      dataCadastro: req.body.dataCadastro || new Date().toLocaleDateString('pt-BR'),
      createdAt: new Date()
    };
    
    const result = await db.collection('usuarios').insertOne(usuario);
    res.status(201).json({ 
      success: true, 
      id: result.insertedId,
      message: 'Usuário salvo no MongoDB' 
    });
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ - Obter todos os usuários
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await db.collection('usuarios')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, data: usuarios });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ - Obter usuário por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const usuario = await db.collection('usuarios').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ - Buscar usuário por email
app.get('/api/usuarios/email/:email', async (req, res) => {
  try {
    const usuario = await db.collection('usuarios').findOne({ 
      email: req.params.email 
    });
    
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE - Atualizar usuário
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const { id: _, ...dados } = req.body; // Remove id do body
    
    const result = await db.collection('usuarios').updateOne(
      { _id: new ObjectId(req.params.id) },
      { 
        $set: { 
          ...dados,
          updatedAt: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Usuário atualizado no MongoDB' 
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Deletar usuário
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const result = await db.collection('usuarios').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Usuário deletado do MongoDB' 
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: db ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${MONGO_URI}/${DB_NAME}`);
});
