import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
} from 'react-native';
import {
  Text,
  Button,
  Provider as PaperProvider,
  Snackbar,
} from 'react-native-paper';

import { useNavigation, useRoute, NavigationProp, RouteProp, ParamListBase } from '@react-navigation/native';

import FormPicker from '../components/FormPicker';
import {
  opcionesAccidente,
  opcionesLesion,
  opcionesClasificacion,
  opcionesPotencial,
  opcionesActividad,
  opcionesAQuienOcurrio,
  opcionesMedidas,
  accionesInseguras,
  condicionesInseguras,
} from '../utils/opciones';

import { validarCamposIncidente } from '../utils/validadores';
import { formatearFechaChile } from '../utils/formatters';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

import useFormularioEvento from '../hooks/useFormularioEvento';
import { useNumeroReporte } from '../hooks/useNumeroReporte';
import { useSubirImagen } from '../hooks/useSubirImagen';

import * as ImagePicker from 'expo-image-picker';
import CampoTexto from '../components/CampoTexto';
import SelectorMultipleChips from '../components/SelectorMultipleChips';

interface RouteParams extends RouteProp<ParamListBase> {
  cargo: string;
  zona: string;
  subZona: string;
  lugarEspecifico: string;
  fechaHora: string;
}

export default function IncidenteScreen() {

  const {
    tipoAccidente, setTipoAccidente,
    lesion, setLesion,
    actividad, setActividad,
    clasificacion, setClasificacion,
    potencial, setPotencial,
    medidasSeleccionadas, setMedidasSeleccionadas,
    quienAfectado, setQuienAfectado,
    descripcion, setDescripcion,
    fechaReporte,
    fechaConfirmadaReporte,
    accionesSeleccionadas, setAccionesSeleccionadas,
    condicionesSeleccionadas, setCondicionesSeleccionadas,
    imagenLocal, setImagenLocal,
    imagenCloudinaryURL, setImagenCloudinaryURL,
    expandirAcciones, setExpandirAcciones,
    expandirCondiciones, setExpandirCondiciones,
    expandirMedidas, setExpandirMedidas,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
  } = useFormularioEvento();

  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteParams>();
  const { cargo, zona, subZona, lugarEspecifico, fechaHora } = route.params as RouteParams;

  const { obtenerNumeroReporte } = useNumeroReporte();
  const { subirImagen } = useSubirImagen();

  const guardarReporte = async () => {
    const numero = await obtenerNumeroReporte();
    const año = new Date().getFullYear();
    const fechaCreacion = new Date().toISOString();

    const reporteCompleto = {
      numeroReporte: `Reporte ${numero} - ${año}`,
      año,
      cargo,
      zona,
      subZona,
      lugarEspecifico,
      fechaHora,
      tipoAccidente,
      lesion,
      actividad,
      clasificacion,
      potencial,
      medidasSeleccionadas,
      quienAfectado,
      descripcion,
      fechaReporte: fechaReporte.toISOString(),
      fechaReporteLocal: formatearFechaChile(fechaReporte),
      accionesSeleccionadas,
      condicionesSeleccionadas,
      fechaCreacion,
      imagen: imagenCloudinaryURL || '',
    };

    try {
      await addDoc(collection(db, 'reportes'), reporteCompleto);
      setAlertaMensaje(`✅ ${reporteCompleto.numeroReporte} guardado con éxito`);
      setAlertaVisible(true);
      setTimeout(() => {
        navigation.navigate('Acciones');
      }, 1500);
    } catch (error) {
      console.error('Error al guardar el reporte:', error);
      setAlertaMensaje('❌ Error al guardar el reporte');
      setAlertaVisible(true);
    }
  }

  const manejarFinalizar = async () => {
    const mensaje = validarCamposIncidente({
      tipoAccidente,
      lesion,
      actividad,
      clasificacion,
      potencial,
      quienAfectado,
      descripcion,
      fechaConfirmadaReporte,
      accionesSeleccionadas,
      condicionesSeleccionadas,
      imagen: imagenCloudinaryURL
    });

    if (mensaje) {
      setAlertaMensaje(mensaje || 'Completa todos los campos obligatorios.');
      setAlertaVisible(true);
      return;
    }

    guardarReporte();
  }

  const tomarImagenYSubir = async () => {
    const resultado = await ImagePicker.launchCameraAsync({ mediaTypes: 'images', quality: 0.7 });

    if (!resultado.canceled && resultado.assets?.length > 0) {
      const uri = resultado.assets[0].uri;
      setImagenLocal(uri);

      const url = await subirImagen(uri);
      if (url) setImagenCloudinaryURL(url);
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>

          <Text style={styles.title}>Detalle del Reporte</Text>

          <FormPicker label="Tipo de accidente:" selectedValue={tipoAccidente} onValueChange={setTipoAccidente} options={opcionesAccidente} />

          {tipoAccidente !== 'Cuasi Accidente' && (
            <FormPicker label="Tipo de lesión:" selectedValue={lesion} onValueChange={setLesion} options={opcionesLesion} />
          )}

          <FormPicker label="Actividad que realizaba:" selectedValue={actividad} onValueChange={setActividad} options={opcionesActividad} />

          <FormPicker
            label="Clasificación del incidente:"
            selectedValue={clasificacion}
            onValueChange={setClasificacion}
            options={opcionesClasificacion}
          />

          {clasificacion === 'Acción Insegura' && (
            <>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 8 }}>
                Acciones Inseguras
              </Text>

              <SelectorMultipleChips
                titulo="Acciones Inseguras del incidente:"
                opciones={accionesInseguras}
                seleccionados={accionesSeleccionadas}
                setSeleccionados={setAccionesSeleccionadas}
                expandido={expandirAcciones}
                setExpandido={setExpandirAcciones}
              />
            </>
          )}

          {clasificacion === 'Condición Insegura' && (
            <>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 8 }}>
                Condiciones Inseguras
              </Text>

              <SelectorMultipleChips
                titulo="Condiciones Inseguras del incidente:"
                opciones={condicionesInseguras}
                seleccionados={condicionesSeleccionadas}
                setSeleccionados={setCondicionesSeleccionadas}
                expandido={expandirCondiciones}
                setExpandido={setExpandirCondiciones}
              />
            </>
          )}

          <FormPicker label="Potencial del incidente:" selectedValue={potencial} onValueChange={setPotencial} options={opcionesPotencial} />

          <Text style={styles.subtitle}>Medidas de control aplicadas:</Text>
          <SelectorMultipleChips
            titulo="Medidas de control aplicadas:"
            opciones={opcionesMedidas}
            seleccionados={medidasSeleccionadas}
            setSeleccionados={setMedidasSeleccionadas}
            expandido={expandirMedidas}
            setExpandido={setExpandirMedidas}
          />

          <FormPicker label="¿A quién le ocurrió?" selectedValue={quienAfectado} onValueChange={setQuienAfectado} options={opcionesAQuienOcurrio} />

          <CampoTexto
            label="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Describe el incidente"
            multiline
          />

          <Button mode="outlined" onPress={tomarImagenYSubir}>
            Capturar Imagen del Incidente
          </Button>

          {imagenLocal && (
            <Image source={{ uri: imagenLocal }} style={{ width: 200, height: 200 }} />
          )}

          <Button
            mode="contained"
            onPress={manejarFinalizar}
            style={styles.button}
            labelStyle={{ color: '#fff' }}
          >
            Finalizar Reporte
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  imagenPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D32F2F',
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
    marginBottom: 10,
    color: '#D32F2F',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#000000',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    textAlignVertical: 'top',
    color: '#000',
  },
  dateButton: {
    marginVertical: 10,
    borderColor: '#D32F2F',
    borderWidth: 1,
  },
  button: {
    marginTop: 30,
    marginBottom: 40,
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#D32F2F',
  },
});