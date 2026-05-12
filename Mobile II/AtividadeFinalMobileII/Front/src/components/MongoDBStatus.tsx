import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/theme';
import { mongodbService } from '../utils/mongodbService';

export function MongoDBStatus() {
  const [conectado, setConectado] = useState<boolean | null>(null);

  useEffect(() => {
    verificarConexao();
    const interval = setInterval(verificarConexao, 10000); // Verifica a cada 10s
    return () => clearInterval(interval);
  }, []);

  const verificarConexao = async () => {
    const status = await mongodbService.verificarConexao();
    setConectado(status);
  };

  if (conectado === null) return null; // Carregando

  return (
    <View style={[styles.container, conectado ? styles.conectado : styles.desconectado]}>
      <Ionicons 
        name={conectado ? 'cloud-done' : 'cloud-offline'} 
        size={12} 
        color={conectado ? Colors.success : Colors.textMuted} 
      />
      <Text style={[styles.texto, conectado ? styles.textoConectado : styles.textoDesconectado]}>
        {conectado ? 'MongoDB Conectado' : 'MongoDB Offline'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  conectado: {
    backgroundColor: '#E6FFFA',
  },
  desconectado: {
    backgroundColor: Colors.surface,
  },
  texto: {
    fontSize: 10,
    fontWeight: '600',
  },
  textoConectado: {
    color: Colors.success,
  },
  textoDesconectado: {
    color: Colors.textMuted,
  },
});
