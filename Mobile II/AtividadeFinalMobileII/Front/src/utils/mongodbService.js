// Serviço para comunicação com MongoDB via API REST
const MONGODB_API_URL = 'http://localhost:3000/api';

// Mapeamento: ID do SQLite -> ID do MongoDB
const idMap = new Map();

export const mongodbService = {
  // CREATE
  async salvarUsuario(usuario) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao salvar no MongoDB');
      }
      
      const result = await response.json();
      console.log('✅ Salvo no MongoDB:', result.id);
      return result;
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      // Não bloqueia se o MongoDB estiver offline
      return null;
    }
  },

  // READ ALL
  async obterTodosUsuarios() {
    try {
      const response = await fetch(`${MONGODB_API_URL}/usuarios`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários do MongoDB');
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      return [];
    }
  },

  // READ ONE
  async obterUsuarioPorId(mongoId) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/usuarios/${mongoId}`);
      
      if (!response.ok) {
        throw new Error('Usuário não encontrado no MongoDB');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      return null;
    }
  },

  // UPDATE
  async atualizarUsuario(mongoId, dados) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/usuarios/${mongoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar no MongoDB');
      }
      
      const result = await response.json();
      console.log('✅ Atualizado no MongoDB');
      return result;
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      return null;
    }
  },

  // DELETE
  async deletarUsuario(mongoId) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/usuarios/${mongoId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao deletar do MongoDB');
      }
      
      const result = await response.json();
      console.log('✅ Deletado do MongoDB');
      return result;
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      return null;
    }
  },

  // Health check
  async verificarConexao() {
    try {
      const response = await fetch(`${MONGODB_API_URL.replace('/api', '')}/health`);
      const result = await response.json();
      return result.mongodb === 'connected';
    } catch {
      return false;
    }
  },
};
