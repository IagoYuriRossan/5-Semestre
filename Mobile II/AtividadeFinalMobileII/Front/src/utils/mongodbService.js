// Serviço para comunicação com MongoDB via API REST (Sistema de Auditoria/Eventos)
// IP base da API (configurado em Front/.env via EXPO_PUBLIC_API_URL)
// Para Android emulator (Android Studio) use 10.0.2.2 como fallback.
let MONGODB_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.7.86:3001/api';
const ANDROID_EMULATOR_BASE = 'http://10.0.2.2:3001/api';
// Ative logs verbosos apenas para depuração local
const ENABLE_VERBOSE_LOG = false;

// Estado interno de conectividade — atualizado por verificarConexao()
let _backendOnline = false;

export const mongodbService = {
  /** Retorna true se o backend estava online na última verificação */
  estaOnline() {
    return _backendOnline;
  },
  /**
   * Registrar evento de CRIAÇÃO de usuário
   * @param {Object} usuario - Dados do usuário criado
   */
  async registrarCriacao(usuario) {
    try {
      const online = await this.verificarConexao();
      if (!online) {
        console.warn('⚠️ Skipping registro de criação: backend offline');
        return null;
      }
      const evento = {
        acao: 'cadastro',
        userId: usuario.id,
        userName: usuario.nome,
        campos: [
          { campo: 'nome', valor: usuario.nome },
          { campo: 'email', valor: usuario.email },
          { campo: 'telefone', valor: usuario.telefone },
          { campo: 'cep', valor: usuario.cep },
          { campo: 'rua', valor: usuario.rua },
          { campo: 'numero', valor: usuario.numero },
          { campo: 'bairro', valor: usuario.bairro },
          { campo: 'cidade', valor: usuario.cidade },
          { campo: 'uf', valor: usuario.uf }
        ]
      };

      const response = await fetch(`${MONGODB_API_URL}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao registrar evento de cadastro');
      }
      
      const result = await response.json();
      console.log('✅ Evento CADASTRO registrado no MongoDB:', result.eventId);
      return result;
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      return null;
    }
  },

  /**
   * Registrar evento de ATUALIZAÇÃO de usuário
   * @param {Object} usuarioAntes - Estado anterior do usuário
   * @param {Object} usuarioDepois - Estado novo do usuário
   */
  async registrarAtualizacao(usuarioAntes, usuarioDepois) {
    try {
      const online = await this.verificarConexao();
      if (!online) {
        console.warn('⚠️ Skipping registro de alteração: backend offline');
        return null;
      }
      // Identificar campos alterados com valores antes/depois
      const campos = [];
      const camposParaComparar = ['nome', 'email', 'senha', 'telefone', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'uf'];
      
      camposParaComparar.forEach(campo => {
        if (usuarioAntes[campo] !== usuarioDepois[campo]) {
          campos.push({
            campo,
            antes: usuarioAntes[campo] || '',
            depois: usuarioDepois[campo] || ''
          });
        }
      });

      const evento = {
        acao: 'alteracao',
        userId: usuarioDepois.id,
        userName: usuarioDepois.nome,
        campos
      };

      const response = await fetch(`${MONGODB_API_URL}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao registrar evento de alteração');
      }
      
      const result = await response.json();
      console.log(`✅ Evento ALTERAÇÃO registrado no MongoDB: ${campos.length} campo(s) alterado(s)`);
      return result;
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      return null;
    }
  },

  /**
   * Registrar evento de EXCLUSÃO de usuário
   * @param {Object} usuario - Dados do usuário deletado
   */
  async registrarExclusao(usuario) {
    try {
      const online = await this.verificarConexao();
      if (!online) {
        console.warn('⚠️ Skipping registro de exclusão: backend offline');
        return null;
      }
      const evento = {
        acao: 'exclusao',
        userId: usuario.id,
        userName: usuario.nome,
        campos: [
          { campo: 'nome', valor: usuario.nome },
          { campo: 'email', valor: usuario.email },
          { campo: 'telefone', valor: usuario.telefone },
          { campo: 'cep', valor: usuario.cep },
          { campo: 'rua', valor: usuario.rua },
          { campo: 'numero', valor: usuario.numero },
          { campo: 'bairro', valor: usuario.bairro },
          { campo: 'cidade', valor: usuario.cidade },
          { campo: 'uf', valor: usuario.uf }
        ]
      };

      const response = await fetch(`${MONGODB_API_URL}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao registrar evento de exclusão');
      }
      
      const result = await response.json();
      console.log('✅ Evento EXCLUSÃO registrado no MongoDB:', result.eventId);
      return result;
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      return null;
    }
  },

  /**
   * Registrar evento de CONSULTA de usuário(s)
   * @param {Array} usuarios - Array com dados completos dos usuários consultados
   * @param {String} campoBusca - Campo usado na busca (ex: "id", "nome", "email")
   */
  async registrarConsulta(usuarios, campoBusca = 'id') {
    try {
      const online = await this.verificarConexao();
      if (!online) {
        console.warn('⚠️ Skipping registro de consulta: backend offline');
        return null;
      }
      const evento = {
        acao: 'consulta',
        buscadoPor: campoBusca,
        usuarios: usuarios.map(u => ({
          userId: u.id,
          nome: u.nome,
          email: u.email,
          telefone: u.telefone,
          endereco: `${u.rua}, ${u.numero} - ${u.bairro}, ${u.cidade}/${u.uf}`
        }))
      };

      const response = await fetch(`${MONGODB_API_URL}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao registrar evento de consulta');
      }
      
      const result = await response.json();
      console.log(`✅ Evento CONSULTA registrado (${usuarios.length} usuário(s), campo: ${campoBusca})`);
      return result;
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      return null;
    }
  },

  /**
   * Obter todos os eventos (com filtros opcionais)
   * @param {Object} filters - Filtros: { eventType, userId, limit, skip }
   */
  async obterEventos(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${MONGODB_API_URL}/eventos?${params}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar eventos');
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      return [];
    }
  },

  /**
   * Obter histórico completo de um usuário
   * @param {Number} userId - ID do usuário
   */
  async obterHistoricoUsuario(userId) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/eventos/usuario/${userId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar histórico do usuário');
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      return [];
    }
  },

  /**
   * Obter estatísticas de eventos
   */
  async obterEstatisticas() {
    try {
      const response = await fetch(`${MONGODB_API_URL}/eventos/stats/resumo`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.warn('⚠️ MongoDB indisponível:', error.message);
      return { stats: [], total: 0 };
    }
  },

  // Health check — atualiza flag interna e retorna true/false
  async verificarConexao() {
    // Tenta a URL configurada primeiro; se falhar tenta o emulador Android (10.0.2.2).
    const tryUrls = [MONGODB_API_URL.replace('/api', ''), ANDROID_EMULATOR_BASE.replace('/api', '')];

    const fetchWithTimeout = (url, timeout = 4000) => {
      return Promise.race([
        fetch(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
      ]);
    };

    for (const base of tryUrls) {
      try {
        if (ENABLE_VERBOSE_LOG) console.log('[mongodbService] tentando health em', base + '/health');
        const response = await fetchWithTimeout(`${base}/health`, 4000);
        if (ENABLE_VERBOSE_LOG) console.log('[mongodbService] resposta HTTP', base, response.status);
        if (!response.ok) continue;
        const result = await response.json();
        if (ENABLE_VERBOSE_LOG) console.log('[mongodbService] resultado health', base, result);
        _backendOnline = result.mongodb === 'connected';
        if (_backendOnline) {
          // atualizar MONGODB_API_URL para o base que funcionou
          MONGODB_API_URL = base.endsWith('/api') ? base : `${base}/api`;
          console.log('[mongodbService] backend ONLINE em', MONGODB_API_URL);
          return true;
        }
      } catch (e) {
        if (ENABLE_VERBOSE_LOG) console.log('[mongodbService] falha ao consultar', base, e && e.message ? e.message : e);
        // tentar próxima URL
      }
    }

    _backendOnline = false;
    console.log('[mongodbService] backend OFFLINE');
    return false;
  },

  /**
   * Sincronizar lista completa de usuários do SQLite para MongoDB.
   * Faz upsert nos existentes e remove os que não estão mais na lista.
   * Não gera eventos — é uma sincronização silenciosa de dados.
   * @param {Array} usuarios - Array de usuários do SQLite
   */
  async sincronizarUsuarios(usuarios) {
    try {
      const online = await this.verificarConexao();
      if (!online) {
        console.warn('⚠️ Skipping sync: backend offline');
        return null;
      }
      const response = await fetch(`${MONGODB_API_URL}/usuarios/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarios }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      console.log(`🔄 Sync concluído: ${result.inserted} inseridos, ${result.updated} atualizados, ${result.deleted} removidos`);
      _backendOnline = true;
      return result;
    } catch (error) {
      console.warn('⚠️ Sync de usuários falhou:', error.message);
      _backendOnline = false;
      return null;
    }
  },
};
