import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function RegisterButton({ onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.button, disabled && styles.buttonDisabled]}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>
        Cadastrar endereço
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  textDisabled: {
    color: '#9CA3AF',
  },
});
