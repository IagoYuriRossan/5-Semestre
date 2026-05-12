import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
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
import { Colors } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';
import { obterTodosUsuarios } from '../src/utils/storageService';

const AVATAR_COLORS = Colors.avatarColors;

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
          <Ionicons name="mail-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.email}>{item.email}</Text>
        </View>
        {item.telefone ? (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.telefone}>{item.telefone}</Text>
          </View>
        ) : null}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={11} color={Colors.textMuted} />
          <Text style={styles.data}>{item.dataCadastro}</Text>
        </View>
        {isAdmin && (
            <View style={styles.infoRow}>
            <Ionicons name="finger-print-outline" size={11} color={Colors.primaryLight} />
            <Text style={styles.idTexto}>ID: {item.id}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color={Colors.primary} />
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
            <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.campoBusca}
              placeholder="Buscar por nome ou ID..."
              placeholderTextColor={Colors.textMuted}
              value={busca}
              onChangeText={(t) => { setBusca(t); setPaginaAtual(1); }}
              autoCorrect={false}
            />
            {busca.trim() ? (
                <TouchableOpacity onPress={() => setBusca('')}>
                <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
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
          <Ionicons name="people-outline" size={64} color={Colors.border} />
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
                colors={paginaAtual === 1 ? [Colors.border, Colors.border] : [Colors.gradientStart, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnPagina}
              >
                <Ionicons name="chevron-back" size={16} color={paginaAtual === 1 ? Colors.textMuted : Colors.textOnPrimary} />
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
                colors={paginaAtual === totalPaginas ? [Colors.border, Colors.border] : [Colors.gradientStart, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnPagina}
              >
                <Text style={[styles.btnPaginaTexto, paginaAtual === totalPaginas && styles.btnPaginaTextoDesabilitado]}>Próxima</Text>
                <Ionicons name="chevron-forward" size={16} color={paginaAtual === totalPaginas ? Colors.textMuted : Colors.textOnPrimary} />
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
    backgroundColor: Colors.bg,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  carregandoTexto: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  buscaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  campoBusca: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: Colors.text,
  },
  contagem: {
    fontSize: 13,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.surface,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarLetra: {
    color: Colors.textOnPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  telefone: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  data: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  idTexto: {
    fontSize: 10,
    color: Colors.primaryLight,
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
    gap: 8,
  },
  vazioTexto: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 8,
  },
  vazioSubtexto: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  paginacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  btnPagina: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  btnPaginaTexto: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  btnPaginaTextoDesabilitado: {
    color: Colors.textMuted,
  },
  paginaInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
});
