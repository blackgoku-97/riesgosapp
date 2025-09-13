import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      const user = auth.currentUser;
      const querySnapshot = await getDocs(collection(db, 'perfiles'));
      const data: Usuario[] = [];
      querySnapshot.forEach((docSnap) => {
        const usuario = { id: docSnap.id, ...docSnap.data() } as Usuario;
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
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminarUsuario(id) },
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
    <View className="flex-row bg-neutral-100 dark:bg-neutral-800 p-3 mb-3 rounded-lg border border-neutral-300">
      <View className="flex-1">
        <Text className="text-base font-bold text-institucional-negro dark:text-white">{item.nombre}</Text>
        <Text className="text-sm text-neutral-700 dark:text-neutral-300">Cargo: {item.cargo}</Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">{item.email}</Text>
      </View>
      <View className="justify-around">
        <TouchableOpacity
          className="bg-institucional-negro rounded px-3 py-1 mb-2"
          onPress={() => navigation.navigate('Editar Usuario', { usuario: item })}
        >
          <Text className="text-white font-bold text-sm">Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-institucional-rojo rounded px-3 py-1"
          onPress={() => confirmarEliminar(item.id)}
        >
          <Text className="text-white font-bold text-sm">Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-institucional-blanco dark:bg-neutral-900">
      <View className="items-center py-4">
        <Image
          source={require('../../assets/logo.png')}
          className="w-32 h-32"
          resizeMode="contain"
        />
      </View>

      {cargando ? (
        <Text className="text-center mt-6 text-base text-neutral-600 dark:text-neutral-300">
          Cargando usuarios...
        </Text>
      ) : usuarios.length === 0 ? (
        <Text className="text-center mt-6 text-base text-neutral-600 dark:text-neutral-300">
          No hay usuarios registrados
        </Text>
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