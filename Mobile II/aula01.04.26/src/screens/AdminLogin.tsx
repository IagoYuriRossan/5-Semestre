import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { Banco, autenticarAdmin } from '../config/bd';

interface Props { onLogin: (user: any) => void; onRegister: () => void }

export default function AdminLogin({ onLogin, onRegister }: Props) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!login || !senha) { Toast.show({ type: 'error', text1: 'Preencha login e senha' }); return; }
    setLoading(true);
    try {
      const db = await Banco();
      const user = await autenticarAdmin(db, login.trim(), senha);
      if (!user) { Toast.show({ type: 'error', text1: 'Credenciais inválidas ou não é admin' }); return; }
      Toast.show({ type: 'success', text1: 'Bem vindo, admin' });
      onLogin(user);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Erro no login' });
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Admin</Text>
      <TextInput style={styles.input} placeholder="Login ou Email" value={login} onChangeText={setLogin} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.link]} onPress={onRegister}>
        <Text style={styles.linkText}>Ir para Cadastro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#f7f8fc' },
  title: { fontSize:22, fontWeight:'700', marginBottom:12, color:'#1f2937' },
  input: { height:48, borderWidth:1, borderColor:'#e6e9f2', borderRadius:10, padding:12, marginBottom:10, backgroundColor:'#fff' },
  button: { backgroundColor:'#111827', height:48, borderRadius:10, alignItems:'center', justifyContent:'center', marginBottom:8 },
  buttonText: { color:'#fff', fontWeight:'700' },
  link: { backgroundColor:'transparent' },
  linkText: { color:'#3b82f6' }
});
