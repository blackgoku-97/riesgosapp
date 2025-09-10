import {
  SafeAreaView,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';

import {
  opcionesArea,
  opcionesAgenteMaterial,
  opcionesActividad,
  opcionesProceso,
  opcionesPeligro,
  opcionesMedidas,
  Area,
} from '../utils/opcionesPlanificaciones';
import { validarCamposPlanificacion, formatearFechaChile } from '../utils';
import {
  FormPicker,
  SelectorMultipleChips,
  CampoTexto,
  MatrizRiesgo,
} from '../components';
import { useFormularioPlanificacion, useSubirImagen } from '../hooks';
import {
  guardarPlanificacion,
  obtenerNumeroPlanificacion,
} from '../services/planificacionService';

const opciones15 = ['1', '2', '3', '4', '5'];

export default function PlanificacionScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { subirImagen } = useSubirImagen();

  const {
    cargo,
    latitud, longitud,
    planTrabajo, setPlanTrabajo,
    area, setArea,
    proceso, setProceso,
    actividad, setActividad,
    peligro, setPeligro,
    agenteMaterial, setAgenteMaterial,
    frecuencia, setFrecuencia,
    severidad, setSeveridad,
    riesgo,
    medidas, setMedidas,
    imagenLocal, setImagenLocal,
    imagenCloudinaryURL, setImagenCloudinaryURL,
    deleteToken, setDeleteToken,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
    expandirProcesos, setExpandirProcesos,
    expandirActividades, setExpandirActividades,
    expandirPeligros, setExpandirPeligros,
    expandirAgenteMaterial, setExpandirAgenteMaterial,
    expandirMedidas, setExpandirMedidas,
    getPayloadNuevo,
    obtenerUbicacionActual,
  } = useFormularioPlanificacion();

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

  const manejarGuardar = async () => {
    try {
      const { latitud: lat, longitud: lng } = await obtenerUbicacionActual();
      const numero = await obtenerNumeroPlanificacion();
      const fechaAhora = new Date();
      const año = fechaAhora.getFullYear();
      const numeroPlanificacion = `${numero} - ${año}`;

      const mensaje = validarCamposPlanificacion({
        cargo,
        planTrabajo,
        latitud: lat,
        longitud: lng,
        area,
        proceso,
        actividad,
        peligro,
        agenteMaterial,
        frecuencia,
        severidad,
        medidas,
        imagen: imagenCloudinaryURL,
      });
      if (mensaje) {
        setAlertaMensaje(mensaje);
        setAlertaVisible(true);
        return;
      }

      const payload = getPayloadNuevo({
        numeroPlanificacion,
        año,
        fechaPlanificacionLocal: formatearFechaChile(fechaAhora),
        imagen: imagenCloudinaryURL || '',
        deleteToken: deleteToken || '',
        latitud: lat,
        longitud: lng,
      });

      await guardarPlanificacion(payload);
      setAlertaMensaje(`✅ ${numeroPlanificacion} guardada con éxito`);
      setAlertaVisible(true);
      setTimeout(() => {
        navigation.navigate('Acciones');
      }, 1500);
    } catch (error) {
      console.error('Error al guardar la planificación:', error);
      setAlertaMensaje('❌ Error al guardar la planificación');
      setAlertaVisible(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-institucional-blanco dark:bg-neutral-900">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          className="px-4 py-6"
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
            📋 Planificación Diaria
          </Text>

          {latitud && longitud && (
            <View style={{ height: 240, marginBottom: 16 }}>
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
                <Marker
                  coordinate={{ latitude: latitud, longitude: longitud }}
                  title="Ubicación actual"
                />
              </MapView>
            </View>
          )}

          <CampoTexto
            label="Plan de Trabajo:"
            value={planTrabajo}
            onChangeText={setPlanTrabajo}
            placeholder="Describe el plan de trabajo..."
            multiline
          />

          <FormPicker
            label="Área de Trabajo:"
            selectedValue={area}
            onValueChange={(nuevoArea) => {
              setArea(nuevoArea as Area);
              setPeligro([]);
            }}
            options={opcionesArea}
          />

          <SelectorMultipleChips
            titulo="Proceso:"
            opciones={opcionesProceso[area] ?? []}
            seleccionados={proceso}
            setSeleccionados={setProceso}
            expandido={expandirProcesos}
            setExpandido={setExpandirProcesos}
          />

          <SelectorMultipleChips
            titulo="Actividad:"
            opciones={opcionesActividad[area] ?? []}
            seleccionados={actividad}
            setSeleccionados={setActividad}
            expandido={expandirActividades}
            setExpandido={setExpandirActividades}
          />

          <SelectorMultipleChips
            titulo="Peligros:"
            opciones={opcionesPeligro[area] ?? []}
            seleccionados={peligro}
            setSeleccionados={setPeligro}
            expandido={expandirPeligros}
            setExpandido={setExpandirPeligros}
          />

          <SelectorMultipleChips
            titulo="Agente Material:"
            opciones={opcionesAgenteMaterial[area] ?? []}
            seleccionados={agenteMaterial}
            setSeleccionados={setAgenteMaterial}
            expandido={expandirAgenteMaterial}
            setExpandido={setExpandirAgenteMaterial}
          />

          {cargo?.trim().toLowerCase() === 'encargado de prevención de riesgos' && (
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
                Nivel de Riesgo: {riesgo || '—'}
              </Text>
              <MatrizRiesgo />
            </>
          )}
          
          <SelectorMultipleChips
            titulo="Medidas de Control:"
            opciones={opcionesMedidas}
            seleccionados={medidas}
            setSeleccionados={setMedidas}
            expandido={expandirMedidas}
            setExpandido={setExpandirMedidas}
          />

          <Button
            mode="outlined"
            onPress={tomarImagenYSubir}
            className="border border-neutral-400 rounded-md my-4"
          >
            📷 Capturar Imagen de la Actividad
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
            onPress={manejarGuardar}
            className="bg-institucional-rojo rounded-md"
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
          >
            💾 Guardar Planificación
          </Button>

          <Snackbar
            visible={alertaVisible}
            onDismiss={() => setAlertaVisible(false)}
            duration={3000}
            className="bg-red-600"
          >
            {alertaMensaje}
          </Snackbar>

          <View className="h-10" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}