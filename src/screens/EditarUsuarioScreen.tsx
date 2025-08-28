import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  View,
  Image,
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
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
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-institucional-blanco dark:bg-neutral-900 px-4 py-6">
      <View className="items-center mb-6">
        <Image
          source={require('../../assets/logo.png')}
          className="w-32 h-32"
          resizeMode="contain"
        />
      </View>

      <Text className="text-xl font-bold text-institucional-rojo text-center mb-6">
        Editar Usuario
      </Text>

      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        className="border border-neutral-300 rounded-md px-4 py-2 mb-4 text-institucional-negro bg-neutral-100 dark:bg-neutral-800 dark:text-white"
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Cargo"
        value={cargo}
        onChangeText={setCargo}
        className="border border-neutral-300 rounded-md px-4 py-2 mb-4 text-institucional-negro bg-neutral-100 dark:bg-neutral-800 dark:text-white"
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        className="border border-neutral-300 rounded-md px-4 py-2 mb-4 text-institucional-negro bg-neutral-100 dark:bg-neutral-800 dark:text-white"
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        onPress={guardarCambios}
        className="bg-institucional-rojo rounded-md py-3 mt-2 items-center"
      >
        <Text className="text-white font-bold text-base">Guardar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}