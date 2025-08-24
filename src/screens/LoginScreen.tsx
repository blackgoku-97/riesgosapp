import { useState } from 'react';
import { SafeAreaView, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';

export default function LoginScreen() {
  const styles = useEstilosPantalla();
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Acciones');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.comunes.container}>
      <Image source={require('../../assets/logo.png')} style={styles.comunes.logo} />

      <Text style={styles.acciones.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.comunes.input}
        placeholderTextColor="#888"
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
        style={[styles.comunes.button, { marginBottom: 16 }]} // margen debajo del botón
        labelStyle={styles.comunes.label}
      >
        Ingresar
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.comunes.link}>¿No tienes cuenta? Crea una</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}