import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { getDatabase } from '../src/utils/database';

export default function Index() {
  useEffect(() => {
    // Inicializa o banco de dados ao carregar o app
    getDatabase().catch(console.error);
  }, []);

  // Redireciona para a tela de cadastro como página inicial
  return <Redirect href="/cadastro" />;
}
