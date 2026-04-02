import React, { useState, Component } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import RegisterUser from './src/screens/RegisterUser';
import AdminLogin from './src/screens/AdminLogin';
import UsersScreen from './src/screens/UsersScreen';

// Error boundary para exibir crash na tela em vez de tela preta
class ErrorBoundary extends Component<{children: React.ReactNode}, {error: string|null}> {
  constructor(props: any) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e: any) { return { error: String(e) }; }
  render() {
    if (this.state.error) {
      return (
        <View style={eb.container}>
          <Text style={eb.title}>Erro capturado:</Text>
          <ScrollView><Text style={eb.msg}>{this.state.error}</Text></ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}
const eb = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fee2e2', padding:20, paddingTop:60 },
  title: { fontWeight:'700', fontSize:18, color:'#dc2626', marginBottom:8 },
  msg: { fontSize:13, color:'#7f1d1d', fontFamily: 'monospace' },
});

type Screen = 'adminLogin' | 'register' | 'users';

function Main() {
  const [screen, setScreen] = useState<Screen>('adminLogin');
  const [admin, setAdmin] = useState<any>(null);
  const [ready] = useState(true);

  if (!ready) return <View style={{flex:1, backgroundColor:'#f7f8fc'}} />;

  return (
    <>
      {screen === 'adminLogin' && <AdminLogin onLogin={(u)=>{ setAdmin(u); setScreen('users'); }} onRegister={()=>setScreen('register')} />}
      {screen === 'register' && <RegisterUser onDone={()=>setScreen('adminLogin')} />}
      {screen === 'users' && admin && <UsersScreen user={admin} onLogout={()=>{ setAdmin(null); setScreen('adminLogin'); }} />}
    </>
  );
}

export default function App(){
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <Main />
      </ErrorBoundary>
      <Toast />
    </SafeAreaProvider>
  );
}
