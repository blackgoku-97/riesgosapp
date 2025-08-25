import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

interface Usuario {
  id: string;
  nombre: string;
  cargo: string;
  email: string;
}

export default function VerUsuariosScreen({ usuarios }: { usuarios: Usuario[] }) {
  const handleResetPassword = (email: string) => {
    Alert.alert(
      '¿Restablecer contraseña?',
      `Se enviará un correo de restablecimiento a:\n${email}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'default',
          onPress: async () => {
            try {
              await sendPasswordResetEmail(auth, email);
              Alert.alert('✅ Éxito', `Correo enviado a:\n${email}`);
            } catch (error: any) {
              console.error(error);
              Alert.alert('❌ Error', error.message || 'No se pudo enviar el correo');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Usuario }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.cargo}>Cargo: {item.cargo}</Text>
        <Text style={styles.email}>Email: {item.email}</Text>
        <Text style={styles.pass}>Contraseña: ••••••</Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleResetPassword(item.email)}
      >
        <Text style={styles.btnTxt}>Restablecer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={usuarios}
      keyExtractor={(u) => u.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          No hay usuarios registrados
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cargo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  pass: {
    fontSize: 13,
    color: '#999',
  },
  btn: {
    alignSelf: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 14,
  },
});