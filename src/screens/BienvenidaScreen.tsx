import { SafeAreaView, StyleSheet, Image } from 'react-native';
import { Text, Button, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function BienvenidaScreen() {
  
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* Logo Institucional */}
        <Image source={require('../../assets/logo.png')} style={styles.logo} />

        {/* Título */}
        <Text style={styles.title}>Bienvenido</Text>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>Gestión de Riesgos y Reporte de Incidentes</Text>

        {/* Botón para comenzar */}
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Acciones')}
          style={styles.button}
          labelStyle={{ color: 'white', fontSize: 16 }}
        >
          Comenzar
        </Button>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 220,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#D32F2F',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#000000',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#D32F2F',
    borderRadius: 6,
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
});