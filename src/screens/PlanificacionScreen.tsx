import { ScrollView, SafeAreaView, StyleSheet, View, Image, TextInput } from 'react-native';
import { Text, Button, Snackbar, PaperProvider } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import useFormularioPlanificacion from '../hooks/useFormularPlanificacion';

import { validarCamposPlanificacion } from '../utils/validadores';
import { guardarPlanificacion, obtenerNumeroPlanificacion } from '../utils/firestoreUtils';
import { opcionesArea, opcionesAgenteMaterial, opcionesActividad, opcionesProceso, opcionesPeligro, opcionesRiesgo, opcionesMedidas, Area } from '../utils/opcionesPlanificaciones';

import SelectorMultipleChips from '../components/SelectorMultipleChips';
import FormPicker from '../components/FormPicker';

import * as ImagePicker from 'expo-image-picker';
import { useSubirImagen } from '../hooks/useSubirImagen';

export default function PlanificacionScreen() {

  const navigation = useNavigation<NavigationProp<any>>();

  const {
    planTrabajo, setPlanTrabajo,
    area, setArea,
    proceso, setProceso,
    actividad, setActividad,
    peligro, setPeligro,
    agenteMaterial, setAgenteMaterial,
    riesgo, setRiesgo,
    medidas, setMedidas,
    imagenLocal, setImagenLocal,
    imagenCloudinaryURL, setImagenCloudinaryURL,
    expandirPeligros, setExpandirPeligros,
    expandirMedidas, setExpandirMedidas,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
  } = useFormularioPlanificacion();

  const { subirImagen } = useSubirImagen();

  const tomarImagenYSubir = async () => {
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets?.length > 0) {
      const uri = resultado.assets[0].uri;
      setImagenLocal(uri);

      const url = await subirImagen(uri);
      if (url) setImagenCloudinaryURL(url);
    }
  };

  const manejarGuardar = async () => {
    const mensaje = validarCamposPlanificacion({
      planTrabajo,
      area,
      proceso,
      actividad,
      peligro,
      agenteMaterial,
      riesgo,
      medidas,
      imagen: imagenCloudinaryURL
    });
    if (mensaje) {
      setAlertaMensaje(mensaje);
      setAlertaVisible(true);
      return;
    }

    try {
      const numeroPlanificacion = await obtenerNumeroPlanificacion();

      await guardarPlanificacion({
        numeroPlanificacion,
        planTrabajo,
        area,
        proceso,
        actividad,
        peligro,
        agenteMaterial,
        riesgo,
        medidas,
        imagen: imagenCloudinaryURL || ''
      });

      setAlertaMensaje(`✅ ${numeroPlanificacion} guardada con éxito`);
      setAlertaVisible(true);
      setTimeout(() => {
        navigation.navigate('Acciones');
      }, 1500);
    } catch (error) {
      console.error('Error al guardar:', error);
      setAlertaMensaje('❌ Error al guardar la planificación');
      setAlertaVisible(true);
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          <View style={styles.logoContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          </View>

          <Text style={styles.title}>📋 Crear Planificación Diaria</Text>

          <View style={styles.espaciado}>
            <Text style={styles.label}>Plan de Trabajo:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe el plan de trabajo para esta jornada..."
              value={planTrabajo}
              onChangeText={setPlanTrabajo}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <FormPicker
            label="Área de Trabajo:"
            selectedValue={area}
            onValueChange={(nuevoArea) => {
              setArea(nuevoArea as Area);
              setPeligro([]);
            }}
            options={opcionesArea}
          />
          <FormPicker label="Proceso:" selectedValue={proceso} onValueChange={setProceso} options={opcionesProceso} />
          <FormPicker label="Actividad:" selectedValue={actividad} onValueChange={setActividad} options={opcionesActividad} />

          <View style={styles.espaciado}>
            <Text style={styles.label}>Peligros:</Text>
            <SelectorMultipleChips
              titulo="Seleccionar peligros:"
              opciones={opcionesPeligro[area] ?? []}
              seleccionados={peligro}
              setSeleccionados={setPeligro}
              expandido={expandirPeligros}
              setExpandido={setExpandirPeligros}
            />
          </View>

          <FormPicker label="Agente Material:" selectedValue={agenteMaterial} onValueChange={setAgenteMaterial} options={opcionesAgenteMaterial} />

          <View style={styles.espaciado}>
            <Text style={styles.label}>Medidas de Control:</Text>
            <SelectorMultipleChips
              titulo="Seleccionar medidas:"
              opciones={opcionesMedidas}
              seleccionados={medidas}
              setSeleccionados={setMedidas}
              expandido={expandirMedidas}
              setExpandido={setExpandirMedidas}
            />
          </View>

          <FormPicker label="Nivel de Riesgo:" selectedValue={riesgo} onValueChange={setRiesgo} options={opcionesRiesgo} />

          <Button mode="outlined" onPress={tomarImagenYSubir} style={{ marginTop: 20 }}>
            📷 Capturar Imagen de la Actividad
          </Button>

          {imagenLocal && (
            <Image source={{ uri: imagenLocal }} style={{ width: 200, height: 200, alignSelf: 'center', marginVertical: 10 }} />
          )}

          <Button mode="contained" onPress={manejarGuardar} style={styles.button} labelStyle={{ color: 'white' }}>
            💾 Guardar Planificación
          </Button>

          <Snackbar
            visible={alertaVisible}
            onDismiss={() => setAlertaVisible(false)}
            duration={3000}
            style={{ backgroundColor: '#D32F2F' }}
          >
            {alertaMensaje}
          </Snackbar>

          <SafeAreaView style={{ height: 80 }} />
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  espaciado: { marginVertical: 12 },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
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
  textArea: {
    borderWidth: 1,
    borderColor: '#D32F2F',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FFF5F5',
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