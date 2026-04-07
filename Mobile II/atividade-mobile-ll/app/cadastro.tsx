import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { buscarEnderecoPorCep } from '../src/utils/cepService';
import { salvarUsuario } from '../src/utils/storageService';

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

export default function CadastroScreen() {
  // Dados pessoais
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [telefone, setTelefone] = useState('');

  // Endereço
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cepEncontrado, setCepEncontrado] = useState(false);

  // UI
  const [carregando, setCarregando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [modalUfVisivel, setModalUfVisivel] = useState(false);

  const limparEndereco = () => {
    setRua('');
    setBairro('');
    setCidade('');
    setUf('');
    setCepEncontrado(false);
  };

  const handleBuscarCep = async () => {
    if (!cep.trim()) {
      Alert.alert('Atenção', 'Digite o CEP antes de buscar.');
      return;
    }
    setBuscandoCep(true);
    limparEndereco();
    try {
      const endereco = await buscarEnderecoPorCep(cep);
      setRua(endereco.rua);
      setBairro(endereco.bairro);
      setCidade(endereco.cidade);
      setUf(endereco.uf);
      setCepEncontrado(true);
    } catch (erro) {
      Alert.alert('Erro', (erro as Error).message);
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleCadastrar = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Nome, e-mail e senha são obrigatórios.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (cep.trim() && !cepEncontrado) {
      Alert.alert('Atenção', 'Clique em "Buscar" para pesquisar o endereço pelo CEP antes de salvar.');
      return;
    }

    setCarregando(true);
    try {
      await salvarUsuario({ nome, email, senha, telefone, cep, rua, numero, bairro, cidade, uf });
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      setNome(''); setEmail(''); setSenha(''); setConfirmarSenha('');
      setTelefone(''); setCep(''); setNumero('');
      limparEndereco();
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível cadastrar: ' + (erro as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.subtitulo}>Preencha os dados abaixo para criar sua conta</Text>

          {/* ── Dados Pessoais ── */}
          <View style={styles.secaoContainer}>
            <Ionicons name="person-circle-outline" size={18} color="#667EEA" />
            <Text style={styles.secao}>Dados pessoais</Text>
          </View>

          <View style={styles.grupo}>
            <Text style={styles.label}>Nome completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: João Silva"
              placeholderTextColor="#aaa"
              value={nome}
              onChangeText={setNome}
              editable={!carregando}
            />
          </View>

          <View style={styles.grupo}>
            <Text style={styles.label}>E-mail *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: joao@email.com"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!carregando}
            />
          </View>

          <View style={styles.grupo}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: (11) 99999-9999"
              placeholderTextColor="#aaa"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
              editable={!carregando}
            />
          </View>

          <View style={styles.grupo}>
            <Text style={styles.label}>Senha * (mín. 6 caracteres)</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite uma senha"
              placeholderTextColor="#aaa"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              editable={!carregando}
            />
          </View>

          <View style={styles.grupo}>
            <Text style={styles.label}>Confirmar senha *</Text>
            <TextInput
              style={styles.input}
              placeholder="Repita a senha"
              placeholderTextColor="#aaa"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
              editable={!carregando}
            />
          </View>

          {/* ── Endereço ── */}
          <View style={[styles.secaoContainer, { marginTop: 10 }]}>
            <Ionicons name="location-outline" size={18} color="#667EEA" />
            <Text style={styles.secao}>Endereço</Text>
          </View>

          {/* CEP + botão Buscar */}
          <View style={styles.grupo}>
            <Text style={styles.label}>CEP</Text>
            <View style={styles.linha}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Ex.: 01310-100"
                placeholderTextColor="#aaa"
                value={cep}
                onChangeText={(v) => { setCep(v); if (cepEncontrado) limparEndereco(); }}
                keyboardType="numeric"
                maxLength={9}
                editable={!carregando && !buscandoCep}
              />
              <TouchableOpacity
                onPress={handleBuscarCep}
                disabled={buscandoCep || carregando}
              >
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.btnBuscar, buscandoCep && styles.botaoDesabilitado]}
                >
                  {buscandoCep
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.btnBuscarTexto}>Buscar</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Campos preenchidos pelo CEP */}
          <View style={styles.grupo}>
            <Text style={styles.label}>Rua / Logradouro</Text>
            <TextInput
              style={[styles.input, styles.inputReadOnly]}
              placeholder="Preenchido ao buscar o CEP"
              placeholderTextColor="#bbb"
              value={rua}
              editable={false}
            />
          </View>

          <View style={styles.grupo}>
            <Text style={styles.label}>Bairro</Text>
            <TextInput
              style={[styles.input, styles.inputReadOnly]}
              placeholder="Preenchido ao buscar o CEP"
              placeholderTextColor="#bbb"
              value={bairro}
              editable={false}
            />
          </View>

          <View style={styles.grupo}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput
              style={[styles.input, styles.inputReadOnly]}
              placeholder="Preenchida ao buscar o CEP"
              placeholderTextColor="#bbb"
              value={cidade}
              editable={false}
            />
          </View>

          {/* UF — seletor */}
          <View style={styles.grupo}>
            <Text style={styles.label}>UF (Estado)</Text>
            <TouchableOpacity
              style={[styles.input, styles.seletor]}
              onPress={() => setModalUfVisivel(true)}
              disabled={carregando}
            >
              <Text style={uf ? styles.seletorTexto : styles.seletorPlaceholder}>
                {uf || 'Selecione a UF'}
              </Text>
              <Text style={styles.seletorSeta}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Número — único campo manual de endereço */}
          <View style={styles.grupo}>
            <Text style={styles.label}>Número</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 42"
              placeholderTextColor="#aaa"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
              editable={!carregando}
            />
          </View>

          <TouchableOpacity
            onPress={handleCadastrar}
            disabled={carregando}
            style={{ marginTop: 18 }}
          >
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.botao, carregando && styles.botaoDesabilitado]}
            >
              {carregando
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.botaoTexto}>Criar conta</Text>
                  </>
              }
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal UF */}
      <Modal visible={modalUfVisivel} animationType="slide" transparent onRequestClose={() => setModalUfVisivel(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalUfCard}>
            <View style={styles.modalUfHeader}>
              <Text style={styles.modalUfTitulo}>Selecione a UF</Text>
              <TouchableOpacity onPress={() => setModalUfVisivel(false)}>
                <Text style={styles.modalUfFechar}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={UFS}
              keyExtractor={(item) => item}
              numColumns={4}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.ufItem, uf === item && styles.ufItemAtivo]}
                  onPress={() => { setUf(item); setModalUfVisivel(false); }}
                >
                  <Text style={[styles.ufItemTexto, uf === item && styles.ufItemTextoAtivo]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FF' },
  content: { padding: 20, paddingBottom: 40 },
  subtitulo: { fontSize: 14, color: '#6B7194', marginBottom: 22, textAlign: 'center', lineHeight: 20 },
  secaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E5F1',
  },
  secao: {
    fontSize: 12,
    fontWeight: '800',
    color: '#667EEA',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  grupo: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#1A1D3B', marginBottom: 7 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E5F1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1A1D3B',
  },
  inputReadOnly: { backgroundColor: '#EEF0F8', color: '#6B7194' },
  linha: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  btnBuscar: {
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 85,
  },
  btnBuscarTexto: { color: '#fff', fontWeight: '700', fontSize: 14 },
  seletor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seletorTexto: { fontSize: 15, color: '#1A1D3B' },
  seletorPlaceholder: { fontSize: 15, color: '#A8AEBF' },
  seletorSeta: { fontSize: 13, color: '#A8AEBF' },
  botao: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#667EEA',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  botaoDesabilitado: { opacity: 0.5 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  // Modal UF
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26,29,59,0.5)',
    justifyContent: 'flex-end',
  },
  modalUfCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '60%',
  },
  modalUfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalUfTitulo: { fontSize: 18, fontWeight: '700', color: '#1A1D3B' },
  modalUfFechar: { fontSize: 24, color: '#A8AEBF', paddingHorizontal: 4 },
  ufItem: {
    flex: 1,
    margin: 5,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E5F1',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  ufItemAtivo: { borderColor: '#667EEA', backgroundColor: '#F0F2FF' },
  ufItemTexto: { fontSize: 14, fontWeight: '600', color: '#6B7194' },
  ufItemTextoAtivo: { color: '#667EEA', fontWeight: '700' },
});
