import { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

import {
  opcionesAccidente,
  opcionesLesion,
  opcionesPotencial,
  opcionesActividad,
  opcionesAQuienOcurrio,
  opcionesMedidas,
} from '../utils/opciones';

import { useFormularioEvento } from '../hooks';

import {
  FormPicker,
  CampoTexto,
  SelectorFechaHora,
  SelectorMultipleChips,
  SeccionClasificacion,
  VistaImagen,
} from '../components';

export default function EditarReporteScreen() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<any>>();
  const { id: reporteId } = route.params as { id: string };

  const {
    cargo,
    latitud, longitud,
    lugarEspecifico, setLugarEspecifico,
    fechaHora, setFechaHora,
    fechaConfirmada, setFechaConfirmada,
    tipoAccidente, setTipoAccidente,
    lesion, setLesion,
    actividad, setActividad,
    clasificacion, setClasificacion,
    accionesSeleccionadas, setAccionesSeleccionadas,
    condicionesSeleccionadas, setCondicionesSeleccionadas,
    potencial, setPotencial,
    medidasSeleccionadas, setMedidasSeleccionadas,
    quienAfectado, setQuienAfectado,
    descripcion, setDescripcion,
    imagen, setImagen,
    expandirAcciones, setExpandirAcciones,
    expandirCondiciones, setExpandirCondiciones,
    expandirMedidas, setExpandirMedidas,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
    setearDatos, getPayload,
  } = useFormularioEvento();

  useEffect(() => {
    const cargarReporte = async () => {
      const ref = doc(db, 'reportes', reporteId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setearDatos(snap.data());
      }
    };
    cargarReporte();
  }, []);

  const guardarComoNuevo = async () => {
    const payload = getPayload();

    // Agregamos campos para diferenciarlo
    const nuevoReporte = {
      ...payload,
      fechaCreacion: new Date().toISOString(),
      referenciaOriginal: reporteId, // para saber de dónde viene
    };

    try {
      await addDoc(collection(db, 'reportes'), nuevoReporte);
      setAlertaMensaje('✅ Nuevo reporte creado a partir del original');
      setAlertaVisible(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      console.error('Error creando nuevo reporte:', error);
      setAlertaMensaje('❌ Error al crear el nuevo reporte');
      setAlertaVisible(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-institucional-blanco dark:bg-neutral-900 px-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-xl font-bold text-institucional-rojo text-center mb-4">
            Editar Reporte (se guardará como nuevo)
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
            label="Tipo de Accidente"
            selectedValue={tipoAccidente}
            onValueChange={setTipoAccidente}
            options={opcionesAccidente}
          />

          {tipoAccidente !== 'Cuasi Accidente' && (
            <FormPicker
              label="Lesión"
              selectedValue={lesion}
              onValueChange={setLesion}
              options={opcionesLesion}
            />
          )}

          <FormPicker
            label="Actividad"
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

          <FormPicker
            label="Potencial"
            selectedValue={potencial}
            onValueChange={setPotencial}
            options={opcionesPotencial}
          />

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

          <FormPicker
            label="¿A quién ocurrió?"
            selectedValue={quienAfectado}
            onValueChange={setQuienAfectado}
            options={opcionesAQuienOcurrio}
          />

          <CampoTexto
            label="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Describe el incidente"
            multiline
          />

          <VistaImagen uri={imagen} setUri={setImagen} />

          <Button
            mode="contained"
            onPress={guardarComoNuevo}
            style={{ backgroundColor: '#D32F2F', borderRadius: 6, marginTop: 16 }}
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
          >
            Guardar como Nuevo
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

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