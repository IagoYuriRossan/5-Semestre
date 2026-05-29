#!/usr/bin/env node

/**
 * Script de teste rápido para verificar conectividade MongoDB
 * Execute: node mongodb-server/test-connection.js
 */

const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'atividadeFinalMobile';

async function testarConexao() {
  console.log('🔍 Testando conexão com MongoDB...\n');
  
  try {
    // Conectar
    console.log(`📡 Conectando em: ${MONGO_URI}`);
    const client = await MongoClient.connect(MONGO_URI, { 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000 
    });
    
    console.log('✅ Conectado com sucesso!\n');
    
    // Selecionar database
    const db = client.db(DB_NAME);
    console.log(`📊 Database: ${DB_NAME}`);
    
    // Listar collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections encontradas: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('\nCollections:');
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    }
    
    // Contar documentos na collection usuarios
    const usuariosCount = await db.collection('usuarios').countDocuments();
    console.log(`\n👥 Usuários cadastrados: ${usuariosCount}`);
    
    // Fechar conexão
    await client.close();
    console.log('\n✅ Teste concluído com sucesso!');
    console.log('🚀 Você pode iniciar o servidor agora: npm start');
    
  } catch (error) {
    console.error('\n❌ Erro ao conectar no MongoDB:');
    console.error(`   ${error.message}\n`);
    
    console.log('💡 Dicas:');
    console.log('   1. Certifique-se de que o MongoDB está rodando');
    console.log('   2. Verifique se está usando a porta 27017');
    console.log('   3. Teste no MongoDB Compass: mongodb://localhost:27017');
    
    process.exit(1);
  }
}

testarConexao();
