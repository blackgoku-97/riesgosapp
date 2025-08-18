import {
  SafeAreaView,
  View,
  Image,
  ScrollView,
} from 'react-native';
import {
  Text,
  Button,
  Snackbar,
} from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import {
  opcionesCargo,
  opcionesZona,
  opcionesSubZona,
  opcionesAccidente,
  opcionesLesion,
  opcionesActividad,
  opcionesPotencial,
  opcionesMedidas,
  opcionesAQuienOcurrio,
} from '../utils/opciones';
import { validarCamposReporte } from '../utils/validadores';
import { formatearFechaChile } from '../utils/formatters';

import { FormPicker } from '../components/FormPicker';
import { CampoTexto } from '../components/CampoTexto';
import { SeccionClasificacion } from '../components/SeccionClasificacion';
import { SelectorFechaHora } from '../components/SelectorFechaHora';
import { SelectorMultipleChips } from '../components/SelectorMultipleChips';

import { useFormularioEvento } from '../hooks/useFormularioEvento';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';
import { useSubirImagen } from '../hooks/useSubirImagen';

import { guardarReporte, obtenerNumeroReporte } from '../services/reporteService';
import * as ImagePicker from 'expo-image-picker';

export default function ReporteScreen() {

  const {
    cargo, setCargo,
    zona, setZona,
    subZona, setSubZona,
    lugarEspecifico, setLugarEspecifico,
    fechaHora, setFechaHora,
    fechaConfirmada, setFechaConfirmada,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
    fechaReporte,
    tipoAccidente, setTipoAccidente,
    lesion, setLesion,
    actividad, setActividad,
    clasificacion, setClasificacion,
    accionesSeleccionadas, setAccionesSeleccionadas,
    condicionesSeleccionadas, setCondicionesSeleccionadas,
    medidasSeleccionadas, setMedidasSeleccionadas,
    potencial, setPotencial,
    quienAfectado, setQuienAfectado,
    descripcion, setDescripcion,
    imagenLocal, setImagenLocal,
    imagenCloudinaryURL, setImagenCloudinaryURL,
    fechaConfirmadaReporte,
    expandirAcciones, setExpandirAcciones,
    expandirCondiciones, setExpandirCondiciones,
    expandirMedidas, setExpandirMedidas,
  } = useFormularioEvento();

  const estilos = useEstilosPantalla();

  const { subirImagen } = useSubirImagen();

  const navigation = useNavigation<NavigationProp<any>>();

  const mostrarSubZona = zona === 'Taller' || zona === 'Oficina';

  const manejarGuardarReporte = async () => {

    const numero = await obtenerNumeroReporte();
    const año = new Date().getFullYear();
    const fechaCreacion = new Date().toISOString();
    const numeroReporte = `Reporte ${numero} - ${año}`;

    const mensaje = validarCamposReporte({
      cargo,
      zona,
      subZona,
      mostrarSubZona,
      lugarEspecifico,
      fechaConfirmada,
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
      setAlertaMensaje(mensaje);
      setAlertaVisible(true);
      return;
    }

    const nuevoReporte = {
      numeroReporte,
      año,
      cargo,
      zona,
      subZona,
      lugarEspecifico,
      fechaHora: fechaHora.toISOString(),
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
      await guardarReporte(nuevoReporte);
      setAlertaMensaje(`✅ ${nuevoReporte.numeroReporte} guardado con éxito`);
      setAlertaVisible(true);
      setTimeout(() => {
        navigation.navigate('Acciones');
      }, 1500);
    } catch (error) {
      console.error('Error al guardar el reporte:', error);
      setAlertaMensaje('❌ Error al guardar el reporte');
      setAlertaVisible(true);
    }
  };

  const tomarImagenYSubir = async () => {
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets?.length > 0) {
      const uri = resultado.assets[0].uri;
      setImagenLocal(uri);

      const subida = await subirImagen(uri);
      if (subida) {
        setImagenCloudinaryURL(subida.url);
      }
    }
  };

  return (
    <SafeAreaView style={estilos.comunes.container}>
      <ScrollView
        contentContainerStyle={estilos.comunes.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.reporte.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={estilos.reporte.logo} />
        </View>

        <Text style={estilos.reporte.title}>Reporte de Incidente</Text>

        <FormPicker label="Cargo:" selectedValue={cargo} onValueChange={setCargo} options={opcionesCargo} />
        <FormPicker label="Zona:" selectedValue={zona} onValueChange={setZona} options={opcionesZona} />

        {mostrarSubZona && (
          <FormPicker label="Subzona:" selectedValue={subZona} onValueChange={setSubZona} options={opcionesSubZona[zona] || []} />
        )}

        <CampoTexto label="Lugar del incidente:" value={lugarEspecifico} onChangeText={setLugarEspecifico} placeholder="Lugar del incidente" />

        <SelectorFechaHora
          fechaHora={fechaHora}
          setFechaHora={setFechaHora}
          fechaConfirmada={fechaConfirmada}
          setFechaConfirmada={setFechaConfirmada}
        />

        <FormPicker label="Tipo de accidente:" selectedValue={tipoAccidente} onValueChange={setTipoAccidente} options={opcionesAccidente} />

        {tipoAccidente !== 'Cuasi Accidente' && (
          <FormPicker label="Tipo de lesión:" selectedValue={lesion} onValueChange={setLesion} options={opcionesLesion} />
        )}

        <FormPicker label="Actividad que realizaba:" selectedValue={actividad} onValueChange={setActividad} options={opcionesActividad} />

        <SeccionClasificacion
          clasificacion={clasificacion}
          setClasificacion={setClasificacion}
          accionesSeleccionadas={accionesSeleccionadas}
          setAccionesSeleccionadas={setAccionesSeleccionadas}
          condicionesSeleccionadas={condicionesSeleccionadas}
          setCondicionesSeleccionadas={setCondicionesSeleccionadas}
          expandirAcciones={expandirAcciones}
          setExpandirAcciones={setExpandirAcciones}
          expandirCondiciones={expandirCondiciones}
          setExpandirCondiciones={setExpandirCondiciones}
        />

        <FormPicker label="Potencial del incidente:" selectedValue={potencial} onValueChange={setPotencial} options={opcionesPotencial} />

        <Text style={estilos.reporte.subtitle}>Medidas de control:</Text>
        <SelectorMultipleChips
          titulo="Medidas de control aplicadas:"
          opciones={opcionesMedidas}
          seleccionados={medidasSeleccionadas}
          setSeleccionados={setMedidasSeleccionadas}
          expandido={expandirMedidas}
          setExpandido={setExpandirMedidas}
        />

        <FormPicker label="¿A quién le ocurrió?" selectedValue={quienAfectado} onValueChange={setQuienAfectado} options={opcionesAQuienOcurrio} />

        <CampoTexto label="Descripción" value={descripcion} onChangeText={setDescripcion} placeholder="Describe el incidente" multiline />

        <Button mode="outlined" onPress={tomarImagenYSubir} style={estilos.reporte.captura}>
          Capturar Imagen del Incidente
        </Button>

        {imagenLocal && (
          <Image source={{ uri: imagenLocal }} style={estilos.reporte.imagenPreview} />
        )}

        <Button
          mode="contained"
          onPress={manejarGuardarReporte}
          style={estilos.reporte.button}
          labelStyle={estilos.comunes.label}
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
  );
}