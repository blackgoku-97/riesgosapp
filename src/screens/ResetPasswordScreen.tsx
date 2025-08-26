import { useState } from 'react';
import { SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';

export default function ResetPasswordScreen() {
  const styles = useEstilosPantalla();
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Éxito', 'Revisa tu bandeja de entrada o el spam para restablecer tu contraseña');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.comunes.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <Text style={styles.acciones.title}>Restablecer Contraseña</Text>

          <TextInput
            placeholder="Ingresa tu email registrado"
            value={email}
            onChangeText={setEmail}
            style={styles.comunes.input}
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Button
            mode="contained"
            onPress={handleReset}
            style={styles.comunes.button}
            labelStyle={styles.comunes.label}
            disabled={!email.trim() || loading}
            loading={loading}
          >
            Enviar enlace
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}