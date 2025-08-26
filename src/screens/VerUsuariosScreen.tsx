import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  SafeAreaView,
  Image
} from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type Usuario = {
  id: string;
  nombre: string;
  cargo: string;
  email: string;
};

export default function VerUsuariosScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation<NavigationProp<any>>();

  const obtenerUsuarios = async () => {
    setCargando(true);
    try {
      const user = auth.currentUser; // 📌 Usuario logueado
      const querySnapshot = await getDocs(collection(db, 'perfiles'));
      const data: Usuario[] = [];
      querySnapshot.forEach((docSnap) => {
        const usuario = { id: docSnap.id, ...docSnap.data() } as Usuario;
        // Excluir al administrador actual
        if (usuario.id !== user?.uid) {
          data.push(usuario);
        }
      });
      setUsuarios(data);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const confirmarEliminar = (id: string) => {
    Alert.alert(
      '¿Eliminar usuario?',
      'Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminarUsuario(id) }
      ]
    );
  };

  const eliminarUsuario = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'perfiles', id));
      obtenerUsuarios();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  };

  const renderItem = ({ item }: { item: Usuario }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.cargo}>Cargo: {item.cargo}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <View style={{ justifyContent: 'space-around' }}>
        <TouchableOpacity
          style={[styles.btn, styles.btnEditar]}
          onPress={() => navigation.navigate('Editar Usuario', { usuario: item })}
        >
          <Text style={styles.btnTxt}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnEliminar]}
          onPress={() => confirmarEliminar(item.id)}
        >
          <Text style={styles.btnTxt}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* Logo en la parte superior */}
      <View style={{ alignItems: 'center', paddingVertical: 16 }}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={{ width: 120, height: 120 }} 
          resizeMode="contain"
        />
      </View>

      {cargando ? (
        <Text style={styles.estadoTxt}>Cargando usuarios...</Text>
      ) : usuarios.length === 0 ? (
        <Text style={styles.estadoTxt}>No hay usuarios registrados</Text>
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1
  },
  nombre: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  cargo: { fontSize: 14, color: '#444' },
  email: { fontSize: 14, color: '#666' },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginVertical: 4,
    alignItems: 'center'
  },
  btnEditar: { backgroundColor: '#000' }, // Rojo institucional
  btnEliminar: { backgroundColor: '#D32F2F' },  // Negro para contraste
  btnTxt: { color: '#fff', fontWeight: 'bold' },
  estadoTxt: { 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16, 
    color: '#555' 
  }
});