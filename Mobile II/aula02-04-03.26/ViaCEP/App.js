import {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator, TextInput } from 'react-native';

export default function App() {
  const [ cep, setCep ] = useState([]);
  const [loading, setLoading] = useState(false);

  const BuscaCep= async(x)=>{
    let url = `https://viacep.com.br/ws/${x}/json/`;
    setLoading(true);
    await fetch(url)
    .then( resp => resp.json())
    .then( data =>{
      console.log(data);
      setCep(data);
      //console.log("-" +  cep);
    })
    .catch(error=> console.log("tipo" +error));

    setLoading(false);
  }

  return(
    <View style={styles.container}>
      <Button title = {"cep"} onPress= {() => BuscaCep('18117200')}/>
      <TextInput
        value={cep.logradouro}
        onChangeText={ text => setCep({...cep,logradouro: text})}
        style={{height: 40, borderColor: 'gray', borderWidth:1}}
      />
        {loading && <ActivityIndicator size="large" color="blue"/>}
      { cep != "" &&(
        <View>
      <Text> Rua : {cep.logradouro} </Text>
      <Text> Bairro : {cep.bairro} </Text>
      <Text> Cidade : {cep.localidade} </Text>
      <Text> Estado : {cep.estado} </Text>
      </View>
      
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});