import { useState } from 'react';
import { SafeAreaView, TextInput, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function LoginScreen() {
  const styles = useEstilosPantalla();
  const navigation = useNavigation<NavigationProp<any>>();
  const [identificador, setIdentificador] = useState(''); // email o rut
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identificador.trim() || !password.trim()) return;
    setLoading(true);
    try {
      let emailToLogin = identificador.trim();

      // Si no parece un email, asumimos que es RUT y lo buscamos en Firestore
      if (!identificador.includes('@')) {
        const perfilesRef = collection(db, 'perfiles');
        const q = query(perfilesRef, where('rut', '==', identificador.toUpperCase()));
        const snap = await getDocs(q);
        if (snap.empty) {
          throw new Error('No existe usuario con ese RUT');
        }
        // Tomar el primer documento que coincida
        const userData = snap.docs[0].data();
        if (!userData.email) {
          throw new Error('El usuario con ese RUT no tiene email registrado');
        }
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
    <SafeAreaView style={styles.comunes.container}>
      <Image source={require('../../assets/logo.png')} style={styles.comunes.logo} />

      <Text style={styles.acciones.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Email o RUT"
        value={identificador}
        onChangeText={setIdentificador}
        style={styles.comunes.input}
        placeholderTextColor="#888"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.comunes.input}
        placeholderTextColor="#888"
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={[styles.comunes.button, { marginBottom: 16 }]}
        labelStyle={styles.comunes.label}
        disabled={isDisabled}
      >
        {loading ? <ActivityIndicator color="#fff" /> : 'Ingresar'}
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.comunes.link}>¿No tienes cuenta? Crea una</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}