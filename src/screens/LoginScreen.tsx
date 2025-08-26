import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { useEstilosPantalla } from '../hooks';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function LoginScreen() {
  const styles = useEstilosPantalla();
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
        if (snap.empty) {
          throw new Error('No existe usuario con ese RUT');
        }
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
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

          <TouchableOpacity onPress={() => navigation.navigate('Recuperar')}>
            <Text style={styles.comunes.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Registro')}
            style={{ marginTop: 12 }} // 👈 separación extra
          >
            <Text style={styles.comunes.link}>¿No tienes cuenta? Crea una</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}