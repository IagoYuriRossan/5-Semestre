import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { obterTodosUsuarios } from '../src/utils/storageService';

const AVATAR_COLORS = ['#667EEA', '#764BA2', '#00C48C', '#FF6584', '#FFB946', '#00D2FF'];

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  dataCadastro: string;
}

const ITENS_POR_PAGINA = 5;

export default function ListaScreen() {
  const { isAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [busca, setBusca] = useState('');

  const carregarUsuarios = async () => {
    setCarregando(true);
    try {
      const lista = await obterTodosUsuarios();
      setUsuarios(lista as Usuario[]);
      setPaginaAtual(1);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarUsuarios();
    }, [])
  );

  const termo = busca.trim().toLowerCase();
  const usuariosFiltrados = termo
    ? usuarios.filter(
        (u) =>
          u.nome.toLowerCase().includes(termo) ||
          u.id.toString().includes(termo)
      )
    : usuarios;

  const totalPaginas = Math.ceil(usuariosFiltrados.length / ITENS_POR_PAGINA);
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const usuariosPagina = usuariosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);

  const renderItem = ({ item, index }: { item: Usuario; index: number }) => (
    <View style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }]}>
        <Text style={styles.avatarLetra}>{item.nome.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nome}>{item.nome}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={13} color="#6B7194" />
          <Text style={styles.email}>{item.email}</Text>
        </View>
        {item.telefone ? (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={12} color="#6B7194" />
            <Text style={styles.telefone}>{item.telefone}</Text>
          </View>
        ) : null}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={11} color="#A8AEBF" />
          <Text style={styles.data}>{item.dataCadastro}</Text>
        </View>
        {isAdmin && (
          <View style={styles.infoRow}>
            <Ionicons name="finger-print-outline" size={11} color="#8B9CF7" />
            <Text style={styles.idTexto}>ID: {item.id}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={styles.carregandoTexto}>Carregando usuários...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={usuariosPagina}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={usuariosFiltrados.length === 0 ? styles.vazio : { padding: 16 }}
      ListHeaderComponent={
        <View>
          <View style={styles.buscaWrapper}>
            <Ionicons name="search-outline" size={18} color="#A8AEBF" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.campoBusca}
              placeholder="Buscar por nome ou ID..."
              placeholderTextColor="#A8AEBF"
              value={busca}
              onChangeText={(t) => { setBusca(t); setPaginaAtual(1); }}
              autoCorrect={false}
            />
            {busca.trim() ? (
              <TouchableOpacity onPress={() => setBusca('')}>
                <Ionicons name="close-circle" size={20} color="#A8AEBF" />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={styles.contagem}>
            {usuariosFiltrados.length} usuário(s) encontrado(s)
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.vazioContainer}>
          <Ionicons name="people-outline" size={64} color="#E2E5F1" />
          <Text style={styles.vazioTexto}>Nenhum usuário cadastrado ainda.</Text>
          <Text style={styles.vazioSubtexto}>Vá à aba Cadastro para adicionar usuários.</Text>
        </View>
      }
      ListFooterComponent={
        totalPaginas > 1 ? (
          <View style={styles.paginacao}>
            <TouchableOpacity
              onPress={() => setPaginaAtual((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
            >
              <LinearGradient
                colors={paginaAtual === 1 ? ['#E2E5F1', '#E2E5F1'] : ['#667EEA', '#764BA2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnPagina}
              >
                <Ionicons name="chevron-back" size={16} color={paginaAtual === 1 ? '#A8AEBF' : '#fff'} />
                <Text style={[styles.btnPaginaTexto, paginaAtual === 1 && styles.btnPaginaTextoDesabilitado]}>Anterior</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.paginaInfo}>
              {paginaAtual} / {totalPaginas}
            </Text>

            <TouchableOpacity
              onPress={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
            >
              <LinearGradient
                colors={paginaAtual === totalPaginas ? ['#E2E5F1', '#E2E5F1'] : ['#667EEA', '#764BA2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnPagina}
              >
                <Text style={[styles.btnPaginaTexto, paginaAtual === totalPaginas && styles.btnPaginaTextoDesabilitado]}>Próxima</Text>
                <Ionicons name="chevron-forward" size={16} color={paginaAtual === totalPaginas ? '#A8AEBF' : '#fff'} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null
      }
      onRefresh={carregarUsuarios}
      refreshing={carregando}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
  },
  carregandoTexto: {
    marginTop: 10,
    color: '#636E72',
  },
  campoBusca: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#2D3436',
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#E4E6EF',
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  contagem: {
    fontSize: 13,
    color: '#636E72',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F1F6',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarLetra: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: '#636E72',
    marginBottom: 2,
  },
  telefone: {
    fontSize: 13,
    color: '#636E72',
    marginBottom: 2,
  },
  data: {
    fontSize: 11,
    color: '#B2BEC3',
    marginTop: 2,
  },
  idTexto: {
    fontSize: 10,
    color: '#A29BFE',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vazioContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  vazioIcone: {
    fontSize: 60,
    marginBottom: 12,
  },
  vazioTexto: {
    fontSize: 16,
    color: '#636E72',
    fontWeight: '600',
  },
  vazioSubtexto: {
    fontSize: 13,
    color: '#B2BEC3',
    marginTop: 6,
    textAlign: 'center',
  },
  paginacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  btnPagina: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  btnPaginaDesabilitado: {
    backgroundColor: '#E4E6EF',
  },
  btnPaginaTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  btnPaginaTextoDesabilitado: {
    color: '#B2BEC3',
  },
  paginaInfo: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '600',
  },
});
