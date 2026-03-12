import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function AddressFields({ address, numero, onNumeroChange, complemento, onComplementoChange }) {
  return (
    <>
      <TextInput
        label="Logradouro"
        mode="outlined"
        value={address.logradouro}
        editable={false}
        style={styles.input}
        left={<TextInput.Icon icon="road" />}
      />
      <TextInput
        label="Bairro"
        mode="outlined"
        value={address.bairro}
        editable={false}
        style={styles.input}
        left={<TextInput.Icon icon="home-city" />}
      />
      <View style={styles.row}>
        <TextInput
          label="Cidade"
          mode="outlined"
          value={address.localidade}
          editable={false}
          style={[styles.input, styles.flex2]}
          left={<TextInput.Icon icon="city" />}
        />
        <View style={styles.gap} />
        <TextInput
          label="UF"
          mode="outlined"
          value={address.uf}
          editable={false}
          style={[styles.input, styles.flex1]}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          label="Número"
          mode="outlined"
          value={numero}
          onChangeText={onNumeroChange}
          style={[styles.input, styles.flex1]}
          keyboardType="number-pad"
        />
        <View style={styles.gap} />
        <TextInput
          label="Complemento"
          mode="outlined"
          value={complemento}
          onChangeText={onComplementoChange}
          style={[styles.input, styles.flex2]}
          left={<TextInput.Icon icon="text-box-outline" />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  gap: {
    width: 10,
  },
});
