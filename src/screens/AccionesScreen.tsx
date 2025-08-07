import { SafeAreaView, StyleSheet, Image, View } from 'react-native';
import { Text, Button, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function AccionesScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* Logo institucional */}
        <Image source={require('../../assets/logo.png')} style={styles.logo} />

        {/* Título principal */}
        <Text style={styles.title}>Centro de Operaciones Preventivas</Text>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>Seleccione una acción a realizar</Text>

        <View style={styles.buttonContainer}>
          {/* Botón: Crear Reporte */}
          <Button
            icon="file-document"
            mode="contained"
            onPress={() => navigation.navigate('Reporte')}
            style={[styles.boton, styles.redBackground]}
            labelStyle={[styles.label, styles.whiteLabel]}
          >
            Crear Reporte
          </Button>

          {/* Botón: Crear Planificación */}
          <Button
            icon="calendar-check"
            mode="contained"
            onPress={() => navigation.navigate('Planificacion')}
            style={[styles.boton, styles.blackBackground]}
            labelStyle={[styles.label, styles.whiteLabel]}
          >
            Crear Planificación
          </Button>

          {/* Botón: Ver Reportes */}
          <Button
            icon="file-search"
            mode="outlined"
            onPress={() => navigation.navigate('Historial Reportes')}
            style={[styles.boton, styles.outline]}
            labelStyle={[styles.label, styles.redLabel]}
          >
            Ver Reportes
          </Button>

          {/* Botón: Ver Planificaciones */}
          <Button
            icon="calendar-multiple"
            mode="outlined"
            onPress={() => navigation.navigate('Historial Planificaciones')}
            style={[styles.boton, styles.outline]}
            labelStyle={[styles.label, styles.redLabel]}
          >
            Ver Planificaciones
          </Button>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000000',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  boton: {
    borderRadius: 6,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
  },
  redBackground: {
    backgroundColor: '#D32F2F',
  },
  blackBackground: {
    backgroundColor: '#000000',
  },
  whiteLabel: {
    color: '#FFFFFF',
  },
  redLabel: {
    color: '#D32F2F',
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D32F2F',
    borderWidth: 1,
  },
});