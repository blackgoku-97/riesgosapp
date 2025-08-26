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
  View
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useEstilosPantalla } from '../hooks';

export default function RegisterScreen() {
  const styles = useEstilosPantalla();
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
    <SafeAreaView style={[styles.comunes.container, { flex: 1 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 24,
            paddingHorizontal: 16,
            justifyContent: 'center'
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
        >
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.comunes.logo}
            />
            <Text style={styles.acciones.title}>Crear Cuenta</Text>
          </View>

          <TextInput
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            style={styles.comunes.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Cargo"
            value={cargo}
            onChangeText={setCargo}
            autoCapitalize="words"
            style={styles.comunes.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="RUT"
            value={rut}
            onChangeText={setRut}
            autoCapitalize="characters"
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
            style={[styles.comunes.button, { marginTop: 16 }]}
            labelStyle={styles.comunes.label}
            disabled={isDisabled}
          >
            {loading ? <ActivityIndicator color="#fff" /> : 'Registrar'}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}