import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

export default function CepInput({ value, onChangeText, onSearch, loading }) {
  const cepMask = useMemo(() => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }, [value]);

  return (
    <View>
      <TextInput
        label="CEP"
        mode="outlined"
        value={cepMask}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        maxLength={9}
        style={styles.input}
        contentStyle={styles.inputContent}
        theme={INPUT_THEME}
        placeholder="00000-000"
        placeholderTextColor="#D1D5DB"
      />

      <TouchableOpacity
        onPress={onSearch}
        disabled={loading}
        style={[styles.button, loading && styles.buttonDisabled]}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, loading && styles.buttonTextDisabled]}>
          Buscar CEP
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  inputContent: {
    color: '#1A1A2E',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 4,
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonTextDisabled: {
    color: '#9CA3AF',
  },
});
