import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');

  const handleRegister = async () => {
    try {
      // 1️⃣ Crear usuario en Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // 2️⃣ Consultar si hay perfiles ya registrados
      const perfilesSnap = await getDocs(collection(db, 'perfiles'));
      const esPrimero = perfilesSnap.empty; // true si no existe ninguno

      // 3️⃣ Guardar perfil con rol dinámico
      await setDoc(doc(db, 'perfiles', userCred.user.uid), {
        nombre,
        email,
        creadoEn: new Date(),
        rol: esPrimero ? 'admin' : 'usuario'
      });

      Alert.alert(
        'Cuenta creada',
        esPrimero
          ? 'Has sido registrado como ADMIN'
          : 'Tu perfil ha sido registrado correctamente'
      );

      navigation.navigate('Acciones');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
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
        color: '#D32F2F',
        marginBottom: 20
      }}>
        Crear Cuenta
      </Text>

      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#888"
        style={{
          borderWidth: 1,
          borderColor: '#000',
          marginBottom: 8,
          width: '100%',
          padding: 10,
          borderRadius: 5,
          color: '#000'
        }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
        style={{
          borderWidth: 1,
          borderColor: '#000',
          marginBottom: 8,
          width: '100%',
          padding: 10,
          borderRadius: 5,
          color: '#000'
        }}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
        style={{
          borderWidth: 1,
          borderColor: '#000',
          marginBottom: 16,
          width: '100%',
          padding: 10,
          borderRadius: 5,
          color: '#000'
        }}
      />

      <View style={{ width: '100%', borderRadius: 5, overflow: 'hidden' }}>
        <Button title="Registrar" color="#D32F2F" onPress={handleRegister} />
      </View>
    </View>
  );
}