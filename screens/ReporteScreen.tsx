import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ScrollView,
} from 'react-native';
import {
  Text,
  Button,
  Provider as PaperProvider,
  Snackbar,
} from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import {
  opcionesCargo,
  opcionesZona,
  opcionesSubZona,
} from '../utils/opciones';

import { validarCamposReporte } from '../utils/validadores';

import FormPicker from '../components/FormPicker';
import CampoTexto from '../components/CampoTexto';
import SelectorFechaHora from '../components/SelectorFechaHora';

import useFormularioEvento from '../hooks/useFormularioEvento';

export default function ReporteScreen() {

  const {
    cargo, setCargo,
    zona, setZona,
    subZona, setSubZona,
    lugarEspecifico, setLugarEspecifico,
    fechaHora, setFechaHora,
    fechaConfirmada, setFechaConfirmada,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje
  } = useFormularioEvento();

  const navigation = useNavigation<NavigationProp<any>>();
  const mostrarSubZona = zona === 'Taller' || zona === 'Oficina';

  const manejarContinuar = () => {
    const mensaje = validarCamposReporte({
      cargo,
      zona,
      subZona,
      mostrarSubZona,
      lugarEspecifico,
      fechaConfirmada,
    });
    if (mensaje) {
      setAlertaMensaje(mensaje);
      setAlertaVisible(true);
      return;
    }

    navigation.navigate('Incidente', {
      cargo,
      zona,
      subZona,
      lugarEspecifico,
      fechaHora: fechaHora.toISOString(),
    });
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>

          <Text style={styles.title}>Reporte de Incidente</Text>

          <FormPicker
            label="Cargo:"
            selectedValue={cargo}
            onValueChange={setCargo}
            options={opcionesCargo}
          />
          <FormPicker
            label="Zona:"
            selectedValue={zona}
            onValueChange={setZona}
            options={opcionesZona}
          />

          {mostrarSubZona && (
            <FormPicker
              label="Subzona:"
              selectedValue={subZona}
              onValueChange={setSubZona}
              options={opcionesSubZona[zona] || []}
            />
          )}

          <CampoTexto
            label="Lugar del incidente:"
            value={lugarEspecifico}
            onChangeText={setLugarEspecifico}
            placeholder="Lugar del incidente"
          />

          <SelectorFechaHora
            fechaHora={fechaHora}
            setFechaHora={setFechaHora}
            fechaConfirmada={fechaConfirmada}
            setFechaConfirmada={setFechaConfirmada}
          />

          <Button
            mode="contained"
            onPress={manejarContinuar}
            style={styles.button}
            labelStyle={{ color: 'white' }}
          >
            Continuar
          </Button>
        </ScrollView>

        <Snackbar
          visible={alertaVisible}
          onDismiss={() => setAlertaVisible(false)}
          duration={3000}
          style={{ backgroundColor: '#D32F2F' }}
        >
          {alertaMensaje}
        </Snackbar>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  logoContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#D32F2F',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  input: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    color: '#000',
  },
  dateButton: {
    marginVertical: 10,
    borderColor: '#D32F2F',
  },
  fechaTexto: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#000000',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#D32F2F',
    borderRadius: 6,
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
});