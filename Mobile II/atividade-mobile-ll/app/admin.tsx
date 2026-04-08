import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';
import { buscarEnderecoPorCep } from '../src/utils/cepService';
import {
  atualizarUsuario,
  deletarUsuario,
  obterTodosUsuarios,
  salvarUsuario
} from '../src/utils/storageService';

const AVATAR_COLORS = Colors.avatarColors;

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

// ─── Tipos ────────────────────────────────────────────────────

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  dataCadastro: string;
}

interface FormData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
}

// ─── Tela de Login ────────────────────────────────────────────

function TelaLogin() {
  const { loginAdmin } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !senha.trim()) {
      setErro('Preencha usuário e senha.');
      return;
    }
    setCarregando(true);
    // Pequeno delay para feedback visual
    setTimeout(() => {
      const ok = loginAdmin(usuario.trim(), senha);
      if (!ok) {
        setErro('Usuário ou senha incorretos.');
      }
      setCarregando(false);
    }, 400);
  };

  return (
    <KeyboardAvoidingView
      style={styles.loginContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.loginCard}>
        <View style={styles.loginIconeWrapper}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.loginIconeGradient}
          >
            <Ionicons name="shield-checkmark" size={32} color={Colors.textOnPrimary} />
          </LinearGradient>
        </View>
        <Text style={styles.loginTitulo}>Acesso Administrativo</Text>
        <Text style={styles.loginSubtitulo}>Faça login para gerenciar usuários</Text>

        <View style={styles.inputComIcone}>
          <Ionicons name="person-outline" size={20} color={Colors.textMuted} style={{ marginRight: 12 }} />
          <TextInput
            style={styles.inputIconeTexto}
            placeholder="Usuário"
            placeholderTextColor={Colors.textMuted}
            value={usuario}
            onChangeText={(v) => { setUsuario(v); setErro(''); }}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputComIcone}>
          <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={{ marginRight: 12 }} />
          <TextInput
            style={styles.inputIconeTexto}
            placeholder="Senha"
            placeholderTextColor={Colors.textMuted}
            value={senha}
            onChangeText={(v) => { setSenha(v); setErro(''); }}
            secureTextEntry
          />
        </View>

        {erro ? <Text style={styles.erroTexto}>{erro}</Text> : null}

        <TouchableOpacity
          onPress={handleLogin}
          disabled={carregando}
          style={{ width: '100%' }}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.botaoPrimario, carregando && styles.botaoDesabilitado]}
          >
            {carregando ? (
              <ActivityIndicator color={Colors.textOnPrimary} />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={20} color={Colors.textOnPrimary} style={{ marginRight: 8 }} />
                <Text style={styles.botaoTexto}>Entrar</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.dica}>Credenciais: admin / admin123</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Painel Admin ─────────────────────────────────────────────

function PainelAdmin() {
  const { logoutAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [modalUfVisivel, setModalUfVisivel] = useState(false);
  const [busca, setBusca] = useState('');
  const formVazio: FormData = { nome: '', email: '', senha: '', telefone: '', cep: '', rua: '', numero: '', bairro: '', cidade: '', uf: '' };
  const [form, setForm] = useState<FormData>(formVazio);

  const usuariosFiltrados = busca.trim()
    ? usuarios.filter(
        (u) =>
          u.nome.toLowerCase().includes(busca.toLowerCase()) ||
          String(u.id).includes(busca.trim())
      )
    : usuarios;

  const carregarUsuarios = useCallback(async () => {
    setCarregando(true);
    try {
      const lista = await obterTodosUsuarios();
      setUsuarios(lista as Usuario[]);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarUsuarios();
    }, [carregarUsuarios])
  );

  const abrirModalNovo = () => {
    setEditando(null);
    setForm(formVazio);
    setModalVisivel(true);
  };

  const handleBuscarCep = async () => {
    if (!form.cep.trim()) {
      Alert.alert('Atenção', 'Digite o CEP antes de buscar.');
      return;
    }
    setBuscandoCep(true);
    setForm((f) => ({ ...f, rua: '', bairro: '', cidade: '', uf: '' }));
    try {
      const endereco = await buscarEnderecoPorCep(form.cep);
      setForm((f) => ({ ...f, rua: endereco.rua, bairro: endereco.bairro, cidade: endereco.cidade, uf: endereco.uf }));
    } catch (erro) {
      Alert.alert('Erro', (erro as Error).message);
    } finally {
      setBuscandoCep(false);
    }
  };

  const abrirModalEditar = (user: Usuario) => {
    setEditando(user);
    setForm({
      nome: user.nome,
      email: user.email,
      senha: user.senha,
      telefone: user.telefone ?? '',
      cep: user.cep ?? '',
      rua: user.rua ?? '',
      numero: user.numero ?? '',
      bairro: user.bairro ?? '',
      cidade: user.cidade ?? '',
      uf: user.uf ?? '',
    });
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setEditando(null);
  };

  const handleSalvar = async () => {
    if (!form.nome.trim() || !form.email.trim() || !form.senha.trim()) {
      Alert.alert('Atenção', 'Nome, e-mail e senha são obrigatórios.');
      return;
    }
    if (form.senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    try {
      if (editando) {
        await atualizarUsuario(editando.id, form);
        Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      } else {
        await salvarUsuario(form);
        Alert.alert('Sucesso', 'Usuário criado com sucesso!');
      }
      fecharModal();
      carregarUsuarios();
    } catch (erro) {
      Alert.alert('Erro', (erro as Error).message);
    }
  };

  const handleDeletar = (user: Usuario) => {    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir o usuário "${user.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarUsuario(user.id);
              carregarUsuarios();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir o usuário.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: Usuario; index: number }) => (
    <View style={styles.card}>
      <View style={[styles.cardAvatar, { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }]}>
        <Text style={styles.cardAvatarLetra}>{item.nome.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNome}>{item.nome}</Text>
        <View style={styles.cardRow}>
          <Ionicons name="mail-outline" size={12} color={Colors.textSecondary} />
          <Text style={styles.cardEmail}>{item.email}</Text>
        </View>
        {item.telefone ? (
          <View style={styles.cardRow}>
            <Ionicons name="call-outline" size={11} color={Colors.textSecondary} />
            <Text style={styles.cardTelefone}>{item.telefone}</Text>
          </View>
        ) : null}
        <View style={styles.cardRow}>
          <Ionicons name="calendar-outline" size={11} color={Colors.textMuted} />
          <Text style={styles.cardData}>{item.dataCadastro}</Text>
        </View>
      </View>
      <View style={styles.cardAcoes}>
        <TouchableOpacity style={styles.btnEditar} onPress={() => abrirModalEditar(item)}>
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDeletar} onPress={() => handleDeletar(item)}>
          <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.painelContainer}>
      {/* Cabeçalho do painel */}
      <View style={styles.painelHeader}>
        <Text style={styles.painelContagem}>{usuarios.length} usuário(s)</Text>
        <TouchableOpacity style={styles.btnLogout} onPress={logoutAdmin}>
          <Ionicons name="log-out-outline" size={16} color={Colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.btnLogoutTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Botão novo usuário */}
      <TouchableOpacity onPress={abrirModalNovo}>
        <LinearGradient
          colors={[Colors.success, Colors.successDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btnNovo}
        >
          <Ionicons name="person-add" size={18} color={Colors.textOnPrimary} style={{ marginRight: 8 }} />
          <Text style={styles.botaoTexto}>Novo Usuário</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Busca */}
      <View style={styles.buscaContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar por nome ou ID..."
          placeholderTextColor={Colors.textMuted}
          value={busca}
          onChangeText={setBusca}
          clearButtonMode="while-editing"
        />
        {busca.trim() ? (
          <TouchableOpacity onPress={() => setBusca('')} style={styles.buscaLimpar}>
            <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Lista */}
      <FlatList
        data={usuariosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={
          usuarios.length === 0 ? styles.listaVazia : { padding: 16, paddingTop: 8 }
        }
        ListEmptyComponent={
            carregando ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
          ) : busca.trim() ? (
            <View style={styles.vazioContainer}>
              <Ionicons name="search-outline" size={56} color={Colors.border} />
              <Text style={styles.vazioTexto}>Nenhum resultado para "{busca}".</Text>
            </View>
          ) : (
            <View style={styles.vazioContainer}>
              <Ionicons name="people-outline" size={56} color={Colors.border} />
              <Text style={styles.vazioTexto}>Nenhum usuário cadastrado.</Text>
            </View>
          )
        }
        onRefresh={carregarUsuarios}
        refreshing={carregando}
      />

      {/* Modal Adicionar / Editar */}
      <Modal visible={modalVisivel} animationType="slide" transparent onRequestClose={fecharModal}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalWrapper}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitulo}>
                {editando ? 'Editar Usuário' : 'Novo Usuário'}
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Nome *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor="#aaa"
                  value={form.nome}
                  onChangeText={(v) => setForm({ ...form, nome: v })}
                />

                <Text style={styles.label}>E-mail *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@exemplo.com"
                  placeholderTextColor="#aaa"
                  value={form.email}
                  onChangeText={(v) => setForm({ ...form, email: v })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Senha * (mín. 6 caracteres)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#aaa"
                  value={form.senha}
                  onChangeText={(v) => setForm({ ...form, senha: v })}
                  secureTextEntry
                />

                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(11) 99999-9999"
                  placeholderTextColor="#aaa"
                  value={form.telefone}
                  onChangeText={(v) => setForm({ ...form, telefone: v })}
                  keyboardType="phone-pad"
                />

                {/* Endereço */}
                <Text style={styles.labelSecao}>Endereço</Text>

                <Text style={styles.label}>CEP</Text>
                <View style={styles.linha}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Ex.: 01310-100"
                    placeholderTextColor="#aaa"
                    value={form.cep}
                    onChangeText={(v) => setForm({ ...form, cep: v })}
                    keyboardType="numeric"
                    maxLength={9}
                  />
                  <TouchableOpacity
                    onPress={handleBuscarCep}
                    disabled={buscandoCep}
                  >
                    <LinearGradient
                      colors={[Colors.gradientStart, Colors.gradientEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.btnBuscar, buscandoCep && styles.botaoDesabilitado]}
                    >
                      {buscandoCep
                        ? <ActivityIndicator color={Colors.textOnPrimary} size="small" />
                        : <Text style={styles.btnBuscarTexto}>Buscar</Text>
                      }
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Rua / Logradouro</Text>
                <TextInput
                  style={[styles.input, styles.inputReadOnly]}
                  placeholder="Preenchido ao buscar CEP"
                  placeholderTextColor="#bbb"
                  value={form.rua}
                  editable={false}
                />

                <Text style={styles.label}>Bairro</Text>
                <TextInput
                  style={[styles.input, styles.inputReadOnly]}
                  placeholder="Preenchido ao buscar CEP"
                  placeholderTextColor="#bbb"
                  value={form.bairro}
                  editable={false}
                />

                <Text style={styles.label}>Cidade</Text>
                <TextInput
                  style={[styles.input, styles.inputReadOnly]}
                  placeholder="Preenchida ao buscar CEP"
                  placeholderTextColor="#bbb"
                  value={form.cidade}
                  editable={false}
                />

                <Text style={styles.label}>UF (Estado)</Text>
                <TouchableOpacity
                  style={[styles.input, styles.seletor]}
                  onPress={() => setModalUfVisivel(true)}
                >
                  <Text style={form.uf ? styles.seletorTexto : styles.seletorPlaceholder}>
                    {form.uf || 'Selecione a UF'}
                  </Text>
                  <Text style={styles.seletorSeta}>▼</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Número</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: 42"
                  placeholderTextColor="#aaa"
                  value={form.numero}
                  onChangeText={(v) => setForm({ ...form, numero: v })}
                  keyboardType="numeric"
                />
              </ScrollView>

              <View style={styles.modalRodape}>
                <TouchableOpacity style={[styles.btnCancelar, { flex: 1 }]} onPress={fecharModal}>
                  <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSalvar} style={{ flex: 1 }}>
                  <LinearGradient
                    colors={[Colors.gradientStart, Colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.botaoPrimario}
                  >
                    <Ionicons name="checkmark-circle" size={18} color={Colors.textOnPrimary} style={{ marginRight: 6 }} />
                    <Text style={styles.botaoTexto}>Salvar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      {/* Modal UF */}
      <Modal visible={modalUfVisivel} animationType="slide" transparent onRequestClose={() => setModalUfVisivel(false)}>
        <View style={styles.ufOverlay}>
          <View style={styles.ufCard}>
            <View style={styles.ufHeader}>
              <Text style={styles.ufTitulo}>Selecione a UF</Text>
              <TouchableOpacity onPress={() => setModalUfVisivel(false)}>
                <Text style={styles.ufFechar}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={UFS}
              keyExtractor={(item) => item}
              numColumns={4}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.ufItem, form.uf === item && styles.ufItemAtivo]}
                  onPress={() => { setForm((f) => ({ ...f, uf: item })); setModalUfVisivel(false); }}
                >
                  <Text style={[styles.ufItemTexto, form.uf === item && styles.ufItemTextoAtivo]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Tela Principal ───────────────────────────────────────────

export default function AdminScreen() {
  const { isAdmin } = useAuth();
  return isAdmin ? <PainelAdmin /> : <TelaLogin />;
}

// ─── Estilos ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Login
  loginContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    padding: 24,
  },
  loginCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 32,
    paddingVertical: 40,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.surface,
    gap: 14,
  },
  loginIcone: {
    fontSize: 48,
    marginBottom: 4,
  },
  loginTitulo: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 0,
  },
  loginSubtitulo: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  erroTexto: {
    color: Colors.danger,
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  dica: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.textMuted,
  },
  inputComIcone: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    width: '100%',
  },
  inputIconeTexto: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 12,
  },
  // Painel
  painelContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  painelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  painelContagem: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 4,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  buscaInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: Colors.text,
  },
  buscaLimpar: {
    padding: 6,
  },
  buscaLimparTexto: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  btnLogout: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  btnLogoutTexto: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  btnNovo: {
    backgroundColor: Colors.success,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    shadowColor: Colors.success,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  // Card
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.surface,
  },
  cardAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardAvatarLetra: {
    color: Colors.textOnPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  cardEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  cardTelefone: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  cardData: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 3,
  },
  cardAcoes: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 8,
  },
  btnEditar: {
    backgroundColor: Colors.surface,
    padding: 8,
    borderRadius: 10,
  },
  btnDeletar: {
    backgroundColor: Colors.dangerLight,
    padding: 8,
    borderRadius: 10,
  },
  btnAcaoTexto: {
    fontSize: 18,
  },
  listaVazia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vazioContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  vazioIcone: {
    fontSize: 50,
    marginBottom: 10,
  },
  vazioTexto: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  // Modal
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalWrapper: {
    width: '100%',
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalRodape: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  // Compartilhados
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    width: '100%',
  },
  botaoPrimario: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: Colors.textOnPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  btnCancelar: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnCancelarTexto: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  labelSecao: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 14,
    marginBottom: 4,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  linha: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  btnBuscar: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 72,
  },
  btnBuscarTexto: { color: Colors.textOnPrimary, fontWeight: '700', fontSize: 13 },
  inputReadOnly: { backgroundColor: Colors.surface, color: Colors.textSecondary },
  seletor: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seletorTexto: { fontSize: 15, color: Colors.text },
  seletorPlaceholder: { fontSize: 15, color: Colors.textMuted },
  seletorSeta: { fontSize: 13, color: Colors.textMuted },
  // Modal UF
  ufOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  ufCard: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '55%',
  },
  ufHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  ufTitulo: { fontSize: 17, fontWeight: '700', color: Colors.text },
  ufFechar: { fontSize: 22, color: Colors.textMuted, paddingHorizontal: 4 },
  ufItem: {
    flex: 1,
    margin: 5,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  ufItemAtivo: { borderColor: Colors.primary, backgroundColor: Colors.surface },
  ufItemTexto: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  ufItemTextoAtivo: { color: Colors.primary },
});
