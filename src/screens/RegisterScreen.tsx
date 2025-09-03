import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  View,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [rut, setRut] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre.trim() || !cargo.trim() || !rut.trim() || !email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const perfilesSnap = await getDocs(collection(db, 'perfiles'));
      const esPrimero = perfilesSnap.empty;

      await setDoc(doc(db, 'perfiles', userCred.user.uid), {
        nombre,
        cargo,
        rut,
        email,
        creadoEn: new Date(),
        rol: esPrimero ? 'admin' : 'usuario',
      });

      Alert.alert(
        'Cuenta creada',
        esPrimero
          ? 'Has sido registrado como ADMIN'
          : 'Tu perfil ha sido registrado correctamente'
      );

      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !nombre.trim() || !cargo.trim() || !rut.trim() || !email.trim() || !password.trim() || loading;

  return (
    <SafeAreaView className="flex-1 bg-institucional-blanco dark:bg-neutral-900">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          className="px-4 py-6"
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-6">
            <Image
              source={require('../../assets/logo.png')}
              className="w-48 h-16 mb-2"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-institucional-rojo">Crear Cuenta</Text>
          </View>

          <TextInput
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            placeholderTextColor="#888"
            className="border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-2 mb-4 text-institucional-negro dark:text-white bg-neutral-100 dark:bg-neutral-800"
          />
          <TextInput
            placeholder="Cargo"
            value={cargo}
            onChangeText={setCargo}
            autoCapitalize="words"
            placeholderTextColor="#888"
            className="border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-2 mb-4 text-institucional-negro dark:text-white bg-neutral-100 dark:bg-neutral-800"
          />
          <TextInput
            placeholder="RUT"
            value={rut}
            onChangeText={setRut}
            autoCapitalize="characters"
            placeholderTextColor="#888"
            className="border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-2 mb-4 text-institucional-negro dark:text-white bg-neutral-100 dark:bg-neutral-800"
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
            className="border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-2 mb-4 text-institucional-negro dark:text-white bg-neutral-100 dark:bg-neutral-800"
          />
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
            className="border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-2 mb-4 text-institucional-negro dark:text-white bg-neutral-100 dark:bg-neutral-800"
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            disabled={isDisabled}
            className="bg-institucional-rojo rounded-md mt-4"
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
          >
            {loading ? <ActivityIndicator color="#fff" /> : 'Registrar'}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}