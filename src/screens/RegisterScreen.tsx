import { useState } from 'react';
import { SafeAreaView, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';

export default function RegisterScreen() {
  const styles = useEstilosPantalla();
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      // 1️⃣ Crear usuario en Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // 2️⃣ Consultar si hay perfiles ya registrados
      const perfilesSnap = await getDocs(collection(db, 'perfiles'));
      const esPrimero = perfilesSnap.empty;

      // 3️⃣ Guardar perfil con rol dinámico
      await setDoc(doc(db, 'perfiles', userCred.user.uid), {
        nombre,
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

  const isDisabled = !nombre.trim() || !email.trim() || !password.trim() || loading;

  return (
    <SafeAreaView style={styles.comunes.container}>
      {/* Logo institucional */}
      <Image
        source={require('../../assets/logo.png')}
        style={styles.comunes.logo}
      />

      <Text style={styles.acciones.title}>Crear Cuenta</Text>

      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
        style={styles.comunes.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.comunes.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.comunes.input}
        placeholderTextColor="#888"
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        style={[styles.comunes.button, { marginBottom: 16 }]}
        labelStyle={styles.comunes.label}
        disabled={isDisabled}
      >
        {loading ? <ActivityIndicator color="#fff" /> : 'Registrar'}
      </Button>
    </SafeAreaView>
  );
}