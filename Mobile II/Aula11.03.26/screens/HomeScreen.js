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
  uf: '',
};

export default function HomeScreen() {
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
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
        uf: data.uf ?? '',
      });
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
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

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
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
});
