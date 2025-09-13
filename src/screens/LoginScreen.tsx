import { useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identificador.trim() || !password.trim()) return;
    setLoading(true);
    try {
      let emailToLogin = identificador.trim();

      if (!identificador.includes('@')) {
        const perfilesRef = collection(db, 'perfiles');
        const q = query(perfilesRef, where('rut', '==', identificador.toUpperCase()));
        const snap = await getDocs(q);
        if (snap.empty) throw new Error('No existe usuario con ese RUT');

        const userData = snap.docs[0].data();
        if (!userData.email) throw new Error('El usuario con ese RUT no tiene email registrado');

        emailToLogin = userData.email;
      }

      await signInWithEmailAndPassword(auth, emailToLogin, password);
      navigation.navigate('Acciones');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !identificador.trim() || !password.trim() || loading;

  return (
    <SafeAreaView className="flex-1 bg-institucional-blanco dark:bg-neutral-900 px-6">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../../assets/logo.png')}
            className="w-48 h-16 mb-6 self-center"
            resizeMode="contain"
          />

          <Text className="text-2xl font-bold text-institucional-rojo text-center mb-2">
            Iniciar Sesión
          </Text>

          <TextInput
            placeholder="Email o RUT"
            value={identificador}
            onChangeText={setIdentificador}
            placeholderTextColor="#888"
            autoCapitalize="none"
            className="border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-2 mb-4 text-base text-institucional-negro dark:text-white bg-neutral-100 dark:bg-neutral-800"
          />

          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#888"
            className="border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-2 mb-4 text-base text-institucional-negro dark:text-white bg-neutral-100 dark:bg-neutral-800"
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={isDisabled}
            className="bg-institucional-rojo rounded-md mb-4"
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
          >
            {loading ? <ActivityIndicator color="#fff" /> : 'Ingresar'}
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate('Recuperar')}>
            <Text className="text-center text-blue-600 underline">
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Registro')} className="mt-3">
            <Text className="text-center text-blue-600 underline">
              ¿No tienes cuenta? Crea una
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}