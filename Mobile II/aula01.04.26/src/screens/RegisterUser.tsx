import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { Banco, inserirUsuario } from "../config/bd";

interface AddressData {
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

interface Props {
  onDone: () => void;
}

export default function RegisterUser({ onDone }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<AddressData>({});
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [loading, setLoading] = useState(false);
  const numRef = useRef<TextInput>(null);

  const handleRegister = async () => {
    if (!nome || !email || !login || !senha) {
      Toast.show({ type: "error", text1: "Preencha nome, login, email e senha" });
      return;
    }
    setLoading(true);
    try {
      const db = await Banco();
      await inserirUsuario(db, nome, email, login, senha || "", cep, address.logradouro, numero, complemento, uf, cidade, 'user');
      Toast.show({ type: "success", text1: "Usuário cadastrado" });
      onDone();
    } catch (error) {
      Toast.show({ type: "error", text1: "Erro ao cadastrar" });
    } finally {
      setLoading(false);
    }
  };

  const handleCepChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const masked = cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
    setCep(masked);
  };

  const handleSearchCep = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      Toast.show({ type: "error", text1: "CEP Inválido", text2: "Digite os 8 números do CEP." });
      return;
    }
    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (data.erro) {
        Toast.show({ type: "error", text1: "CEP não encontrado" });
        return;
      }
      setAddress(data);
      setCidade(data.localidade || "");
      setUf(data.uf || "");
      setTimeout(() => numRef.current?.focus(), 100);
    } catch (e) {
      Toast.show({ type: "error", text1: "Erro de conexão" });
    } finally {
      setLoadingCep(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Login" value={login} onChangeText={setLogin} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

      <View style={styles.cepRow}>
        <TextInput style={[styles.input, {flex:1}]} placeholder="CEP" value={cep} onChangeText={handleCepChange} keyboardType="numeric" maxLength={9} />
        <TouchableOpacity style={styles.cepBtn} onPress={handleSearchCep} disabled={loadingCep}>
          {loadingCep ? <ActivityIndicator color="#fff" /> : <Text style={{color:'#fff'}}>OK</Text>}
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} placeholder="Logradouro" value={address.logradouro || ''} editable={false} />
      <View style={{flexDirection:'row'}}>
        <TextInput ref={numRef} style={[styles.input, {flex:1}]} placeholder="Número" value={numero} onChangeText={setNumero} keyboardType="numeric" />
        <TextInput style={[styles.input, {flex:1, marginLeft:8}]} placeholder="Complemento" value={complemento} onChangeText={setComplemento} />
      </View>
      <View style={{flexDirection:'row'}}>
        <TextInput style={[styles.input, {flex:1}]} placeholder="UF" value={uf} onChangeText={setUf} />
        <TextInput style={[styles.input, {flex:1, marginLeft:8}]} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Cadastrando..." : "Cadastrar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.link]} onPress={onDone}>
        <Text style={styles.linkText}>Voltar ao Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f7f8fc" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12, color: '#1f2937' },
  input: { height: 48, borderWidth: 1, borderColor: "#e6e9f2", borderRadius: 10, padding: 12, marginBottom: 10, backgroundColor:'#fff' },
  button: { backgroundColor: "#3b82f6", height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  buttonText: { color: "#fff", fontWeight: "700" },
  link: { backgroundColor: "transparent" },
  linkText: { color: "#3b82f6" },
  cepRow: { flexDirection:'row', alignItems:'center', marginBottom:10 },
  cepBtn: { backgroundColor:'#10b981', paddingHorizontal:12, paddingVertical:10, marginLeft:8, borderRadius:8 }
});
