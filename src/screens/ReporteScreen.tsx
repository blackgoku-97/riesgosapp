import {
  View,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import {
  opcionesAccidente,
  opcionesLesion,
  opcionesActividad,
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
  MatrizPotencial,
} from '../components';
import {
  useFormularioEvento,
  useSubirImagen,
} from '../hooks';
import {
  guardarReporte,
  obtenerNumeroReporte,
  ReporteData,
} from '../services/reporteService';

const opciones15 = ['1', '2', '3', '4', '5'];

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
    tipoAccidente, setTipoAccidente,
    lesion, setLesion,
    actividad, setActividad,
    clasificacion, setClasificacion,
    accionesSeleccionadas, setAccionesSeleccionadas,
    condicionesSeleccionadas, setCondicionesSeleccionadas,
    medidasSeleccionadas, setMedidasSeleccionadas,
    frecuencia, setFrecuencia,
    severidad, setSeveridad,
    potencial,
    quienAfectado, setQuienAfectado,
    descripcion, setDescripcion,
    imagenLocal, setImagenLocal,
    imagenCloudinaryURL, setImagenCloudinaryURL,
    deleteToken, setDeleteToken,
    fechaConfirmadaReporte,
    expandirAcciones, setExpandirAcciones,
    expandirCondiciones, setExpandirCondiciones,
    expandirMedidas, setExpandirMedidas,
    getPayloadNuevo,
    obtenerUbicacionActual,
  } = useFormularioEvento();

  const manejarGuardarReporte = async () => {
    try {
      const { latitud: lat, longitud: lng } = await obtenerUbicacionActual();
      const numero = await obtenerNumeroReporte();
      const fechaAhora = new Date();
      const año = fechaAhora.getFullYear();
      const numeroReporte = `Reporte ${numero} - ${año}`;
      const mensaje = validarCamposReporte({
        cargo,
        latitud: lat,
        longitud: lng,
        lugarEspecifico,
        fechaConfirmada,
        tipoAccidente,
        lesion,
        actividad,
        clasificacion,
        frecuencia,
        severidad,
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
      const payload: ReporteData = getPayloadNuevo({
        numeroReporte,
        año,
        imagen: imagenCloudinaryURL || '',
        fechaReporteLocal: formatearFechaChile(fechaAhora),
        deleteToken: deleteToken || '',
        latitud: lat,
        longitud: lng,
      });
      await guardarReporte(payload);
      setAlertaMensaje(`✅ ${numeroReporte} guardado con éxito`);
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

        {latitud && longitud && (
          <View style={{ height: 250, marginBottom: 16 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: latitud,
                longitude: longitud,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              }}
              showsUserLocation
            >
              <Marker coordinate={{ latitude: latitud, longitude: longitud }} title="Ubicación actual" />
            </MapView>
          </View>
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

        <FormPicker
          label="¿A quién le ocurrió?"
          selectedValue={quienAfectado}
          onValueChange={setQuienAfectado}
          options={opcionesAQuienOcurrio}
        />

        <FormPicker
          label="Tipo de accidente:"
          selectedValue={tipoAccidente}
          onValueChange={setTipoAccidente}
          options={opcionesAccidente}
        />

        {tipoAccidente !== 'Cuasi Accidente' && (
          <FormPicker
            label="Tipo de lesión:"
            selectedValue={lesion}
            onValueChange={setLesion}
            options={opcionesLesion}
          />
        )}

        <FormPicker
          label="Actividad que realizaba:"
          selectedValue={actividad}
          onValueChange={setActividad}
          options={opcionesActividad}
        />

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

        {cargo?.toLowerCase() === 'encargado de prevención de riesgos' && (
          <>
            <FormPicker
              label="Frecuencia (1–5)"
              selectedValue={frecuencia !== null ? String(frecuencia) : ''}
              onValueChange={(v) => setFrecuencia(Number(v))}
              options={opciones15}
            />
            <FormPicker
              label="Severidad (1–5)"
              selectedValue={severidad !== null ? String(severidad) : ''}
              onValueChange={(v) => setSeveridad(Number(v))}
              options={opciones15}
            />
            <Text className="mt-2 text-base font-semibold text-institucional-negro">
              Potencial: {potencial || '—'}
            </Text>
            <MatrizPotencial />
          </>
        )}

        <Text className="text-base font-semibold text-institucional-negro mb-2">
          Medidas de control:
        </Text>

        <SelectorMultipleChips
          titulo="Medidas de control aplicadas:"
          opciones={opcionesMedidas}
          seleccionados={medidasSeleccionadas}
          setSeleccionados={setMedidasSeleccionadas}
          expandido={expandirMedidas}
          setExpandido={setExpandirMedidas}
        />

        <CampoTexto
          label="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Describe el incidente"
          multiline
        />

        <Button
          mode="outlined"
          onPress={tomarImagenYSubir}
          className="border border-neutral-400 rounded-md my-4"
        >
          Capturar Imagen del Incidente
        </Button>

        {imagenLocal && (
          <Image
            source={{ uri: imagenLocal }}
            className="w-full h-48 rounded-md mb-4"
            resizeMode="cover"
          />
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