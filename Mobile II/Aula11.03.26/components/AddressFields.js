import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import UfPicker from './UfPicker';

const INPUT_THEME = {
  colors: {
    primary: '#2563EB',
    background: '#FFFFFF',
    onSurface: '#1E293B',
    onSurfaceVariant: '#94A3B8',
    outline: '#CBD5E1',
    surfaceVariant: '#FFFFFF',
  },
};

function InfoBlock({ label, value, flex }) {
  const filled = value && value.length > 0;
  return (
    <View style={[styles.infoBlock, flex && { flex }, filled && styles.infoBlockFilled]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, filled && styles.infoValueFilled]} numberOfLines={1} ellipsizeMode="tail">
        {value || '—'}
      </Text>
    </View>
  );
}

export default function AddressFields({ address, uf, onUfChange, numero, onNumeroChange, complemento, onComplementoChange }) {
  return (
    <>
      <InfoBlock label="Logradouro" value={address.logradouro} />
      <InfoBlock label="Bairro" value={address.bairro} />

      <View style={styles.row}>
        <InfoBlock label="Cidade" value={address.localidade} flex={2} />
        <View style={styles.gap} />
        <UfPicker value={uf} onChange={onUfChange} />
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
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  infoBlockFilled: {
    backgroundColor: '#EFF6FF',
    borderLeftColor: '#2563EB',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  infoValueFilled: {
    color: '#1E293B',
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
