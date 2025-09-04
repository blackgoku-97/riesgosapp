import { useEffect } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

import { useFormularioPlanificacion } from '../hooks';

import {
  FormPicker,
  SelectorMultipleChips,
  VistaImagen,
} from '../components';

import {
  opcionesArea,
  opcionesProceso,
  opcionesActividad,
  opcionesPeligro,
  opcionesAgenteMaterial,
  opcionesRiesgo,
  opcionesMedidas,
  Area,
} from '../utils/opcionesPlanificaciones';

export default function EditarPlanificacionScreen() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<any>>();
  const { id: planificacionId } = route.params as { id: string };

  const {
    area, setArea,
    proceso, setProceso,
    actividad, setActividad,
    peligro, setPeligro,
    agenteMaterial, setAgenteMaterial,
    riesgo, setRiesgo,
    medidas, setMedidas,
    imagen, setImagen,
    expandirProcesos, setExpandirProcesos,
    expandirActividades, setExpandirActividades,
    expandirPeligros, setExpandirPeligros,
    expandirAgenteMaterial, setExpandirAgenteMaterial,
    expandirMedidas, setExpandirMedidas,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
  } = useFormularioPlanificacion();

  useEffect(() => {
    const cargarPlanificacion = async () => {
      const ref = doc(db, 'planificaciones', planificacionId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const datos = snap.data();
        setArea(datos.area || '');
        setProceso(datos.proceso || '');
        setActividad(datos.actividad || '');
        setPeligro(datos.peligro || []);
        setAgenteMaterial(datos.agenteMaterial || '');
        setRiesgo(datos.riesgo || '');
        setMedidas(datos.medidas || []);
        setImagen(datos.imagen || '');
      }
    };
    cargarPlanificacion();
  }, []);

  const guardarComoNuevo = async () => {
    const nuevaPlanificacion = {
      area,
      proceso,
      actividad,
      peligro,
      agenteMaterial,
      riesgo,
      medidas,
      imagen,
      fechaCreacion: new Date().toISOString(),
      referenciaOriginal: planificacionId, // para saber de dónde viene
    };

    try {
      await addDoc(collection(db, 'planificaciones'), nuevaPlanificacion);
      setAlertaMensaje('✅ Nueva planificación creada a partir de la original');
      setAlertaVisible(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      console.error('Error creando nueva planificación:', error);
      setAlertaMensaje('❌ Error al crear la nueva planificación');
      setAlertaVisible(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-institucional-blanco dark:bg-neutral-900">
      <ScrollView className="px-5 pb-12" contentInset={{ bottom: 40 }}>
        <Text className="text-xl font-bold text-institucional-rojo text-center mb-4">
          Editar Planificación (se guardará como nueva)
        </Text>

        <FormPicker
          label="Área de Trabajo:"
          selectedValue={area}
          onValueChange={(nuevoArea) => {
            setArea(nuevoArea as Area);
            setPeligro([]);
          }}
          options={opcionesArea}
        />

        <Text className="text-base font-semibold text-institucional-negro mt-4 mb-1">Proceso:</Text>
        <SelectorMultipleChips
          titulo="Seleccionar proceso:"
          opciones={opcionesProceso[area] ?? []}
          seleccionados={proceso}
          setSeleccionados={setProceso}
          expandido={expandirProcesos}
          setExpandido={setExpandirProcesos}
        />

        <Text className="text-base font-semibold text-institucional-negro mt-4 mb-1">Actividad:</Text>
        <SelectorMultipleChips
          titulo="Seleccionar actividad:"
          opciones={opcionesActividad[area] ?? []}
          seleccionados={actividad}
          setSeleccionados={setActividad}
          expandido={expandirActividades}
          setExpandido={setExpandirActividades}
        />

        <Text className="text-base font-semibold text-institucional-negro mt-4 mb-1">Peligros:</Text>
        <SelectorMultipleChips
          titulo="Seleccionar peligros"
          opciones={opcionesPeligro[area] ?? []}
          seleccionados={peligro}
          setSeleccionados={setPeligro}
          expandido={expandirPeligros}
          setExpandido={setExpandirPeligros}
        />

        <Text className="text-base font-semibold text-institucional-negro mt-4 mb-1">Agente Material:</Text>
        <SelectorMultipleChips
          titulo="Seleccionar agente material:"
          opciones={opcionesAgenteMaterial[area] ?? []}
          seleccionados={agenteMaterial}
          setSeleccionados={setAgenteMaterial}
          expandido={expandirAgenteMaterial}
          setExpandido={setExpandirAgenteMaterial}
        />

        <Text className="text-base font-semibold text-institucional-negro mt-4 mb-1">Medidas de Control:</Text>
        <SelectorMultipleChips
          titulo="Seleccionar medidas"
          opciones={opcionesMedidas}
          seleccionados={medidas}
          setSeleccionados={setMedidas}
          expandido={expandirMedidas}
          setExpandido={setExpandirMedidas}
        />

        <FormPicker
          label="Riesgo"
          selectedValue={riesgo}
          onValueChange={setRiesgo}
          options={opcionesRiesgo}
        />

        <VistaImagen uri={imagen} setUri={setImagen} />

        <Button
          mode="contained"
          onPress={guardarComoNuevo}
          style={{ backgroundColor: '#D32F2F', borderRadius: 6, marginTop: 24 }}
          labelStyle={{ color: 'white', fontWeight: 'bold' }}
        >
          Guardar como Nueva
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