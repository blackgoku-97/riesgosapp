import {
  SafeAreaView,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import {
  opcionesAccidente,
  opcionesLesion,
  opcionesActividad,
  opcionesPotencial,
  opcionesMedidas,
  opcionesAQuienOcurrio,
  validarCamposReporte,
  formatearFechaChile,
} from '../utils';

import {
  FormPicker,
  CampoTexto,
  SeccionClasificacion,
  SelectorFechaHora,
  SelectorMultipleChips,
} from '../components';

import {
  useFormularioEvento,
  useSubirImagen,
} from '../hooks';

import {
  guardarReporte,
  obtenerNumeroReporte,
} from '../services/reporteService';

export default function ReporteScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { subirImagen } = useSubirImagen();

  const {
    cargo,
    latitud, longitud,
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
    deleteToken, setDeleteToken,
    fechaConfirmadaReporte,
    expandirAcciones, setExpandirAcciones,
    expandirCondiciones, setExpandirCondiciones,
    expandirMedidas, setExpandirMedidas,
  } = useFormularioEvento();

  const manejarGuardarReporte = async () => {
    const numero = await obtenerNumeroReporte();
    const año = new Date().getFullYear();
    const fechaCreacion = new Date().toISOString();
    const numeroReporte = `Reporte ${numero} - ${año}`;

    const mensaje = validarCamposReporte({
      cargo,
      latitud,
      longitud,
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
      imagen: imagenCloudinaryURL,
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
      latitud,
      longitud,
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
      deleteToken: deleteToken || '',
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
        setDeleteToken(subida.deleteToken);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-institucional-blanco dark:bg-neutral-900 px-4 py-6">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-4">
          <Image
            source={require('../../assets/logo.png')}
            className="w-48 h-16"
            resizeMode="contain"
          />
        </View>

        <Text className="text-xl font-bold text-institucional-rojo mb-4">
          Reporte de Incidente
        </Text>

        <View className="mb-4">
          <Text className="text-base font-semibold text-institucional-negro mb-1">Cargo:</Text>
          <Text className="text-base text-neutral-700 dark:text-neutral-300">{cargo}</Text>
        </View>

        <View className="my-3">
          {latitud && longitud ? (
            <Text className="text-institucional-negro">
              📍 Ubicación: {latitud.toFixed(5)}, {longitud.toFixed(5)}
            </Text>
          ) : (
            <Text className="text-neutral-500">Obteniendo ubicación...</Text>
          )}
        </View>

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

        <Text className="text-base font-semibold text-institucional-negro mb-2">Medidas de control:</Text>
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

        <Button mode="outlined" onPress={tomarImagenYSubir} className="border border-neutral-400 rounded-md my-4">
          Capturar Imagen del Incidente
        </Button>

        {imagenLocal && (
          <Image source={{ uri: imagenLocal }} className="w-full h-48 rounded-md mb-4" resizeMode="cover" />
        )}

        <Button
          mode="contained"
          onPress={manejarGuardarReporte}
          className="bg-institucional-rojo rounded-md"
          labelStyle={{ color: 'white', fontWeight: 'bold' }}
        >
          Finalizar Reporte
        </Button>
      </ScrollView>

      <Snackbar
        visible={alertaVisible}
        onDismiss={() => setAlertaVisible(false)}
        duration={3000}
        className="bg-institucional-rojo"
      >
        {alertaMensaje}
      </Snackbar>
    </SafeAreaView>
  );
}