import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function CepInput({ value, onChangeText, onSearch, loading }) {
  const cepMask = useMemo(() => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }, [value]);

  return (
    <>
      <TextInput
        label="Digite o CEP"
        mode="outlined"
        value={cepMask}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        maxLength={9}
        style={styles.input}
        left={<TextInput.Icon icon="map-marker" />}
        placeholder="00000-000"
      />

      <Button
        mode="contained"
        onPress={onSearch}
        style={styles.button}
        contentStyle={styles.buttonContent}
        disabled={loading}
        icon="magnify"
      >
        Buscar CEP
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
  },
  button: {
    marginBottom: 4,
    borderRadius: 14,
    elevation: 3,
  },
  buttonContent: {
    height: 52,
  },
});
