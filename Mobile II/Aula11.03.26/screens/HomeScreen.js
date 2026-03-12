import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import {
  Card,
  Divider,
  Text,
} from 'react-native-paper';

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

  const handleRegister = () => {
    if (!hasAddress) {
      showSnack('Busque um CEP antes de cadastrar.');
      return;
    }
    showSuccess('✅ Endereço cadastrado com sucesso!');
  };

  const handleSearchCep = async () => {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      showSnack('Digite um CEP válido com 8 dígitos.');
      setAddress(INITIAL_ADDRESS);
      setComplemento('');
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
        setAddress(INITIAL_ADDRESS);
        setComplemento('');
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
      setAddress(INITIAL_ADDRESS);
      setComplemento('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      <TopAlert
        visible={snackVisible}
        message={snackMessage}
        color={snackColor}
        onDismiss={() => setSnackVisible(false)}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 Consulta de CEP</Text>
        <Text style={styles.headerSubtitle}>Powered by ViaCEP</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionLabel}>BUSCAR ENDEREÇO</Text>

            <CepInput
              value={cep}
              onChangeText={setCep}
              onSearch={handleSearchCep}
              loading={loading}
            />

            <LoadingIndicator visible={loading} />

            <Divider style={styles.divider} />
            <Text style={styles.sectionLabel}>RESULTADO</Text>

            <AddressFields
              address={address}
              numero={numero}
              onNumeroChange={setNumero}
              complemento={complemento}
              onComplementoChange={setComplemento}
            />

            <Divider style={styles.divider} />

            <RegisterButton
              onPress={handleRegister}
              disabled={!hasAddress || loading}
            />
          </Card.Content>
        </Card>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#4F46E5',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: 52,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#C7D2FE',
    marginTop: 4,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F3FF',
    padding: 16,
    paddingTop: 20,
  },
  card: {
    borderRadius: 20,
    elevation: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6366F1',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#E0E7FF',
    height: 1.5,
  },
});
