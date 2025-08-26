import { useState } from 'react';
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  SafeAreaView,
  View,
  Image
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';

type Usuario = {
  id: string;
  nombre: string;
  cargo: string;
  email: string;
};

export default function EditarUsuarioScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<{ params: { usuario: Usuario } }, 'params'>>();
  const { usuario } = route.params;

  const [nombre, setNombre] = useState(usuario.nombre);
  const [cargo, setCargo] = useState(usuario.cargo);
  const [email, setEmail] = useState(usuario.email);

  const guardarCambios = async () => {
    try {
      await updateDoc(doc(db, 'perfiles', usuario.id), {
        nombre,
        cargo,
        email,
      });
      Alert.alert('Usuario actualizado', 'Los cambios se guardaron correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo institucional */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Image
          source={require('../../assets/logo.png')} // 📌 Ajusta la ruta a tu logo real
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.titulo}>Editar Usuario</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Cargo"
        value={cargo}
        onChangeText={setCargo}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.btnGuardar} onPress={guardarCambios}>
        <Text style={styles.btnTxt}>Guardar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#000', textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    backgroundColor: '#f9f9f9'
  },
  btnGuardar: {
    backgroundColor: '#D32F2F', // Rojo institucional
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10
  },
  btnTxt: { color: '#fff', fontWeight: 'bold' }
});