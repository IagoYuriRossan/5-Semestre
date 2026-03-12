import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';

const INPUT_THEME = {
  colors: {
    primary: '#1A1A2E',
    background: '#FFFFFF',
    onSurface: '#1A1A2E',
    onSurfaceVariant: '#9CA3AF',
    outline: '#E5E7EB',
    surfaceVariant: '#FFFFFF',
  },
};

function InfoBlock({ label, value, flex }) {
  return (
    <View style={[styles.infoBlock, flex && { flex }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
        {value || '—'}
      </Text>
    </View>
  );
}

export default function AddressFields({ address, numero, onNumeroChange, complemento, onComplementoChange }) {
  return (
    <>
      <InfoBlock label="Logradouro" value={address.logradouro} />
      <InfoBlock label="Bairro" value={address.bairro} />

      <View style={styles.row}>
        <InfoBlock label="Cidade" value={address.localidade} flex={2} />
        <View style={styles.gap} />
        <InfoBlock label="UF" value={address.uf} flex={1} />
      </View>

      <View style={[styles.row, styles.inputRow]}>
        <TextInput
          label="Número"
          mode="outlined"
          value={numero}
          onChangeText={onNumeroChange}
          style={[styles.input, styles.flex1]}
          contentStyle={styles.inputContent}
          theme={INPUT_THEME}
          keyboardType="number-pad"
        />
        <View style={styles.gap} />
        <TextInput
          label="Complemento"
          mode="outlined"
          value={complemento}
          onChangeText={onComplementoChange}
          style={[styles.input, styles.flex2]}
          contentStyle={styles.inputContent}
          theme={INPUT_THEME}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  infoBlock: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
  },
  inputRow: {
    alignItems: 'flex-start',
  },
  gap: {
    width: 10,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  inputContent: {
    color: '#1A1A2E',
  },
});
