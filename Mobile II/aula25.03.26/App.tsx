import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Forms } from "./src/components/Forms";
import { Banco, createTable, inserirUsuario, selectUsuarios, selectUsuarioId, deletarUsuario } from "./src/config/bd";

export default function App() {
  useEffect(() => {
    async function Main() {
      const rbd = await Banco();
      await createTable(rbd);
      //await inserirUsuario(rbd, "Jorge", "jorge@gmail.com");
      const campos = await selectUsuarios(rbd);
      for ( const reg of campos as [{ID_US:number, NOME_US:string, EMAIL_US:string}] ) {
        console.log(reg.ID_US, reg.NOME_US, reg.EMAIL_US);
      }
      console.log("-----------------------------------------");
      //await deletarUsuario(rbd, 4);
      
      const camposId = await selectUsuarioId(rbd, 3) as { ID_US:number, NOME_US:string, EMAIL_US:string};
      console.log(camposId.ID_US, camposId.NOME_US, camposId.EMAIL_US);
      console.log("-----------------------------------------");
      
    }



    Main();
  }, []);

  return (
    <SafeAreaProvider>
      <Forms />
      <Toast />
    </SafeAreaProvider>
  );
}
