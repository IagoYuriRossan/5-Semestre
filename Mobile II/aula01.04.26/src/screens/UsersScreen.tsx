import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert, Modal } from 'react-native';
import Toast from 'react-native-toast-message';
import { Banco, selectUsuariosPaginated, deletarUsuario, atualizarUsuario } from '../config/bd';

interface Props { user:any; onLogout: ()=>void }

const PAGE_SIZE = 4;

export default function UsersScreen({ user, onLogout }: Props) {
  const [db, setDb] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  useEffect(()=>{ (async ()=>{ const d = await Banco(); setDb(d); loadPage(0, d); })(); },[]);

  const loadPage = async (p:number, database?:any) => {
    setLoading(true);
    try {
      const d = database || db;
      const offset = p * PAGE_SIZE;
      const res = await selectUsuariosPaginated(d, PAGE_SIZE, offset);
      setUsers(res || []);
      setPage(p);
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const handleDelete = (id:number) => {
    Alert.alert('Confirmar', 'Deseja deletar este usuário?', [
      { text:'Cancelar', style:'cancel' },
      { text:'Deletar', style:'destructive', onPress: async ()=>{
        await deletarUsuario(db, id); Toast.show({ type:'success', text1:'Usuário deletado' }); loadPage(page);
      }}
    ])
  };

  const openEdit = (item:any) => { setEditing({ ...mapDbToForm(item) }); setEditModalVisible(true); };

  const mapDbToForm = (r:any)=>({ id: r.ID_US, nome: r.NOME_US, email: r.EMAIL_US, login: r.LOGIN_US, senha: r.SENHA_US, cep: r.CEP_US, logradouro: r.LOGRADOURO_US, numero: r.NUMERO_US, complemento: r.COMPLEMENTO_US, uf: r.UF_US, cidade: r.CIDADE_US, role: r.ROLE_US });

  const saveEdit = async ()=>{
    try {
      await atualizarUsuario(db, editing.id, editing);
      Toast.show({ type:'success', text1:'Usuário atualizado' });
      setEditModalVisible(false);
      loadPage(page);
    } catch (e) { Toast.show({ type:'error', text1:'Erro ao atualizar' }); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Usuários</Text>
        <TouchableOpacity onPress={onLogout} style={styles.logout}><Text style={{color:'#fff'}}>Sair</Text></TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item)=>String(item.ID_US)}
        onRefresh={()=>loadPage(page)}
        refreshing={loading}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={{flex:1}}>
              <Text style={styles.name}>{item.NOME_US}</Text>
              <Text style={styles.meta}>{item.EMAIL_US} • {item.LOGIN_US}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={()=>openEdit(item)} style={styles.actionBtn}><Text>Editar</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>handleDelete(item.ID_US)} style={[styles.actionBtn, {marginLeft:8}]}><Text style={{color:'red'}}>Deletar</Text></TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={()=>(<Text style={{textAlign:'center',marginTop:20}}>Nenhum usuário nesta página</Text>)}
      />

      <View style={styles.pager}><TouchableOpacity onPress={()=>{ if(page>0) loadPage(page-1); }} style={styles.pagerBtn}><Text>Anterior</Text></TouchableOpacity>
      <Text> {page+1} </Text>
      <TouchableOpacity onPress={()=>{ loadPage(page+1); }} style={styles.pagerBtn}><Text>Próxima</Text></TouchableOpacity></View>

      <Modal visible={editModalVisible} animationType='slide'>
        <View style={{flex:1,padding:16}}>
          <Text style={{fontSize:20,fontWeight:'700',marginBottom:12}}>Editar Usuário</Text>
          <TextInput style={styles.input} placeholder='Nome' value={editing?.nome} onChangeText={(t)=>setEditing({...editing, nome:t})} />
          <TextInput style={styles.input} placeholder='Email' value={editing?.email} onChangeText={(t)=>setEditing({...editing, email:t})} />
          <TextInput style={styles.input} placeholder='Login' value={editing?.login} onChangeText={(t)=>setEditing({...editing, login:t})} />
          <TextInput style={styles.input} placeholder='Senha' value={editing?.senha} onChangeText={(t)=>setEditing({...editing, senha:t})} />
          <TextInput style={styles.input} placeholder='CEP' value={editing?.cep} onChangeText={(t)=>setEditing({...editing, cep:t})} />
          <TextInput style={styles.input} placeholder='Logradouro' value={editing?.logradouro} onChangeText={(t)=>setEditing({...editing, logradouro:t})} />
          <TextInput style={styles.input} placeholder='Número' value={editing?.numero} onChangeText={(t)=>setEditing({...editing, numero:t})} />
          <TextInput style={styles.input} placeholder='Complemento' value={editing?.complemento} onChangeText={(t)=>setEditing({...editing, complemento:t})} />
          <TextInput style={styles.input} placeholder='UF' value={editing?.uf} onChangeText={(t)=>setEditing({...editing, uf:t})} />
          <TextInput style={styles.input} placeholder='Cidade' value={editing?.cidade} onChangeText={(t)=>setEditing({...editing, cidade:t})} />
          <View style={{flexDirection:'row',marginTop:8}}>
            <TouchableOpacity style={[styles.button,{flex:1}]} onPress={saveEdit}><Text style={{color:'#fff'}}>Salvar</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.button,{flex:1,backgroundColor:'#ccc',marginLeft:8}]} onPress={()=>setEditModalVisible(false)}><Text>Cancelar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f7f8fc',padding:12},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  title:{fontSize:22,fontWeight:'700'},
  logout:{backgroundColor:'#ef4444',padding:8,borderRadius:8},
  card:{backgroundColor:'#fff',padding:12,borderRadius:10,flexDirection:'row',alignItems:'center',marginVertical:6},
  name:{fontWeight:'700',fontSize:16},
  meta:{color:'#6b7280'},
  actions:{flexDirection:'row'},
  actionBtn:{padding:8,backgroundColor:'#e6e6e6',borderRadius:8},
  pager:{flexDirection:'row',alignItems:'center',justifyContent:'center',padding:12},
  pagerBtn:{padding:8,backgroundColor:'#e6e6e6',borderRadius:8,marginHorizontal:8},
  input:{height:44,borderWidth:1,borderColor:'#e6e9f2',borderRadius:8,padding:8,marginBottom:8,backgroundColor:'#fff'},
  button:{backgroundColor:'#111827',padding:12,alignItems:'center',borderRadius:8}
});
