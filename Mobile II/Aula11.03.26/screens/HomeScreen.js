import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import AddressFields from '../components/AddressFields';
import CepInput from '../components/CepInput';
import LoadingIndicator from '../components/LoadingIndicator';
import RegisterButton from '../components/RegisterButton';
import TopAlert from '../components/TopAlert';

const INITIAL_ADDRESS = {
  logradouro: '',
  bairro: '',
  localidade: '',
};

export default function HomeScreen() {
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [uf, setUf] = useState('');
  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [loading, setLoading] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackColor, setSnackColor] = useState('#DC2626');

  const showSnack = (msg) => {
    setSnackColor('#DC2626');
    setSnackMessage(msg);
    setSnackVisible(true);
  };

  const showSuccess = (msg) => {
    setSnackColor('#16A34A');
    setSnackMessage(msg);
    setSnackVisible(true);
  };

  const hasAddress = address.logradouro !== '' || address.localidade !== '';

  const clearAll = () => {
    setCep('');
    setNumero('');
    setComplemento('');
    setUf('');
    setAddress(INITIAL_ADDRESS);
  };

  const handleRegister = () => {
    if (!hasAddress) {
      showSnack('Busque um CEP antes de cadastrar.');
      return;
    }
    showSuccess('✅ Endereço cadastrado com sucesso!');
    clearAll();
  };

  const handleSearchCep = async () => {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      showSnack('Digite um CEP válido com 8 dígitos.');
      clearAll();
      return;
    }

    setLoading(true);
    setSnackVisible(false);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

      if (!response.ok) {
        throw new Error('Falha ao consultar o serviço do ViaCEP.');
      }

      const data = await response.json();

      if (data.erro) {
        showSnack('CEP não encontrado.');
        clearAll();
        return;
      }

      setAddress({
        logradouro: data.logradouro ?? '',
        bairro: data.bairro ?? '',
        localidade: data.localidade ?? '',
      });
      setUf(data.uf ?? '');
      setComplemento(data.complemento ?? '');
    } catch (error) {
      showSnack(error.message || 'Não foi possível buscar o CEP.');
      clearAll();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#1E3A5F" barStyle="light-content" />

      <TopAlert
        visible={snackVisible}
        message={snackMessage}
        color={snackColor}
        onDismiss={() => setSnackVisible(false)}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consulta de CEP</Text>
        <Text style={styles.headerSub}>ViaCEP · busca de endereços</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Buscar</Text>
          <CepInput
            value={cep}
            onChangeText={setCep}
            onSearch={handleSearchCep}
            loading={loading}
          />
          <LoadingIndicator visible={loading} />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Endereço</Text>
          <AddressFields
            address={address}
            uf={uf}
            onUfChange={setUf}
            numero={numero}
            onNumeroChange={setNumero}
            complemento={complemento}
            onComplementoChange={setComplemento}
          />
        </View>

        <View style={styles.divider} />

        <RegisterButton
          onPress={handleRegister}
          disabled={!hasAddress || loading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1E3A5F',
  },
  header: {
    backgroundColor: '#1E3A5F',
    paddingTop: 56,
    paddingBottom: 22,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: '#93B5D3',
    marginTop: 4,
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  divider: {
    height: 0,
    marginVertical: 2,
  },
});
