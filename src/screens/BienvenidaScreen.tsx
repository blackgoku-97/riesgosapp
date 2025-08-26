import { SafeAreaView, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useEstilosPantalla } from '../hooks';

export default function BienvenidaScreen() {
  
  const styles = useEstilosPantalla();
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <SafeAreaView style={styles.comunes.container}>
      <Image source={require('../../assets/logo.png')} style={styles.comunes.logo} />
      <Text style={styles.acciones.title}>Bienvenido</Text>
      <Text style={styles.acciones.subtitle}>Gestión de Riesgos y Reporte de Incidentes</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Login')}
        style={styles.comunes.button}
        labelStyle={styles.comunes.label}
      >
        Comenzar
      </Button>
    </SafeAreaView>
  );
}