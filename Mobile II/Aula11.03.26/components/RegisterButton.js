import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function RegisterButton({ onPress, disabled }) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      disabled={disabled}
      icon="check-circle-outline"
      style={styles.button}
      contentStyle={styles.content}
      buttonColor="#16A34A"
      textColor="#FFFFFF"
    >
      Cadastrar Endereço
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    borderRadius: 14,
    elevation: 3,
  },
  content: {
    height: 52,
  },
});
