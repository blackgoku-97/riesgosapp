import { useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        'Éxito',
        'Revisa tu bandeja de entrada o el spam para restablecer tu contraseña'
      );
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

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
          <Text className="text-2xl font-bold text-institucional-rojo text-center mb-6">
            Restablecer Contraseña
          </Text>

          <TextInput
            placeholder="Ingresa tu email registrado"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#888"
            className="border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-2 mb-6 text-institucional-negro dark:text-white bg-neutral-100 dark:bg-neutral-800"
          />

          <Button
            mode="contained"
            onPress={handleReset}
            disabled={!email.trim() || loading}
            loading={loading}
            className="bg-institucional-rojo rounded-md"
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
          >
            Enviar enlace
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}