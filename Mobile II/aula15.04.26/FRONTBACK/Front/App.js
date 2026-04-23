import { Button, StyleSheet, View } from "react-native";

export default function App() {
  const url = "http://192.168.144.1:3000";
  const find = () => {
    fetch(url)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((e) => {
        console.log(e);
      });
  };

  // Adicionar usuario
  const addUser=()=>{
    fetch(url+"/add",{
      method:'POST',
      body:JSON.stringify({name:'Emerson'}),
      headers:{
        'Content-Type':'application/json',
      }
    })
    .then(res=>res.text())
    .then(text=>console.log(text))
    .catch(e=>console.log(e))
  }

  
    // DELETAR USUÁRIO
    const deleteOne = (X) => {
      console.log(`${url}/${X}`);
      fetch(`${url}/${X}`,{
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(json => console.log(json))
    };

    return (
    <View style={styles.container}>
      <Button
        title="Find"
        onPress={() => find()} />

      <Button
        title="Add"
        onPress={() => addUser()} />

        <Button
          title="deleteOne(X)"
          onPress={() => deleteOne('69e9668e959fa28b79dbc619')} />
    </View>
    );




}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});