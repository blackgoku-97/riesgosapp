import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function LoginScreen() {
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

  const irACrearCuenta = () => {
    navigation.navigate('Registro'); // Asegúrate de tener una pantalla llamada 'Registro'
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF', // Blanco institucional
      padding: 20
    }}>
      {/* Logo institucional */}
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 120, height: 120, marginBottom: 30 }}
        resizeMode="contain"
      />

      <Text style={{
        fontSize: 22,
        fontWeight: 'bold',
        color: '#D32F2F', // Rojo institucional
        marginBottom: 20
      }}>
        Iniciar Sesión
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
        style={{
          borderWidth: 1,
          borderColor: '#000000', // Negro institucional
          marginVertical: 8,
          width: '100%',
          padding: 10,
          borderRadius: 5,
          color: '#000000'
        }}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
        style={{
          borderWidth: 1,
          borderColor: '#000000',
          marginBottom: 16,
          width: '100%',
          padding: 10,
          borderRadius: 5,
          color: '#000000'
        }}
      />

      {/* Botón Ingresar */}
      <View style={{ width: '100%', borderRadius: 5, overflow: 'hidden', marginBottom: 12 }}>
        <Button title="Ingresar" color="#D32F2F" onPress={handleLogin} />
      </View>

      {/* Botón Crear Cuenta */}
      <TouchableOpacity onPress={irACrearCuenta}>
        <Text style={{
          color: '#D32F2F',
          fontWeight: 'bold',
          textDecorationLine: 'underline'
        }}>
          Crear cuenta
        </Text>
      </TouchableOpacity>
    </View>
  );
}