import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
  View,
} from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import {
  SelectorMultipleChips,
  FormPicker,
} from '../components';

import {
  useFormularioPlanificacion,
  useSubirImagen,
} from '../hooks';

import { validarCamposPlanificacion, formatearFechaChile } from '../utils';
import {
  guardarPlanificacion,
  obtenerNumeroPlanificacion,
} from '../services/planificacionService';

import {
  opcionesArea,
  opcionesAgenteMaterial,
  opcionesActividad,
  opcionesProceso,
  opcionesPeligro,
  opcionesRiesgo,
  opcionesMedidas,
  Area,
} from '../utils/opcionesPlanificaciones';

export default function PlanificacionScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const {
    planTrabajo, setPlanTrabajo,
    latitud,
    longitud,
    area, setArea,
    proceso, setProceso,
    actividad, setActividad,
    peligro, setPeligro,
    agenteMaterial, setAgenteMaterial,
    riesgo, setRiesgo,
    medidas, setMedidas,
    imagenLocal, setImagenLocal,
    imagenCloudinaryURL, setImagenCloudinaryURL,
    deleteToken, setDeleteToken,
    expandirProcesos, setExpandirProcesos,
    expandirActividades, setExpandirActividades,
    expandirPeligros, setExpandirPeligros,
    expandirAgenteMaterial, setExpandirAgenteMaterial,
    expandirMedidas, setExpandirMedidas,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
    getPayloadNuevo,
  } = useFormularioPlanificacion();

  const { subirImagen } = useSubirImagen();

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
    const mensaje = validarCamposPlanificacion({
      planTrabajo,
      latitud,
      longitud,
      area,
      proceso,
      actividad,
      peligro,
      agenteMaterial,
      riesgo,
      medidas,
      imagen: imagenCloudinaryURL,
    });

    if (mensaje) {
      setAlertaMensaje(mensaje);
      setAlertaVisible(true);
      return;
    }

    try {
      const numeroPlanificacion = await obtenerNumeroPlanificacion();

      const payload = getPayloadNuevo({
        numeroPlanificacion,
        año: new Date().getFullYear(),
        fechaPlanificacionLocal: formatearFechaChile(new Date()),
        imagen: imagenCloudinaryURL || '',
        deleteToken: deleteToken || '',
      });

      await guardarPlanificacion(payload);

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
            📋 Crear Planificación Diaria
          </Text>

          <View className="mb-4">
            <Text className="text-base font-semibold text-institucional-negro mb-2">
              Plan de Trabajo:
            </Text>
            <TextInput
              placeholder="Describe el plan de trabajo para esta jornada..."
              value={planTrabajo}
              onChangeText={setPlanTrabajo}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholderTextColor="#888"
              className="border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-2 text-institucional-negro dark:text-white bg-neutral-100 dark:bg-neutral-800"
            />
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

          <FormPicker
            label="Área de Trabajo:"
            selectedValue={area}
            onValueChange={(nuevoArea) => {
              setArea(nuevoArea as Area);
              setPeligro([]);
            }}
            options={opcionesArea}
          />

          <View className="mb-4">
            <Text className="text-base font-semibold text-institucional-negro mb-2">Proceso:</Text>
            <SelectorMultipleChips
              titulo="Seleccionar proceso:"
              opciones={opcionesProceso[area] ?? []}
              seleccionados={proceso}
              setSeleccionados={setProceso}
              expandido={expandirProcesos}
              setExpandido={setExpandirProcesos}
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-institucional-negro mb-2">Actividad:</Text>
            <SelectorMultipleChips
              titulo="Seleccionar actividad:"
              opciones={opcionesActividad[area] ?? []}
              seleccionados={actividad}
              setSeleccionados={setActividad}
              expandido={expandirActividades}
              setExpandido={setExpandirActividades}
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-institucional-negro mb-2">Peligros:</Text>
            <SelectorMultipleChips
              titulo="Seleccionar peligros:"
              opciones={opcionesPeligro[area] ?? []}
              seleccionados={peligro}
              setSeleccionados={setPeligro}
              expandido={expandirPeligros}
              setExpandido={setExpandirPeligros}
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-institucional-negro mb-2">Agente Material:</Text>
            <SelectorMultipleChips
              titulo="Seleccionar agente material:"
              opciones={opcionesAgenteMaterial[area] ?? []}
              seleccionados={agenteMaterial}
              setSeleccionados={setAgenteMaterial}
              expandido={expandirAgenteMaterial}
              setExpandido={setExpandirAgenteMaterial}
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-institucional-negro mb-2">Medidas de Control:</Text>
            <SelectorMultipleChips
              titulo="Seleccionar medidas:"
              opciones={opcionesMedidas}
              seleccionados={medidas}
              setSeleccionados={setMedidas}
              expandido={expandirMedidas}
              setExpandido={setExpandirMedidas}
            />
          </View>

          <FormPicker
            label="Nivel de Riesgo:"
            selectedValue={riesgo}
            onValueChange={setRiesgo}
            options={opcionesRiesgo}
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

          <View className="h-12" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}