import { useEffect } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

import { useFormularioPlanificacion } from '../hooks/useFormularioPlanificacion';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';

import { FormPicker } from '../components/FormPicker';
import { SelectorMultipleChips } from '../components/SelectorMultipleChips';
import { VistaImagen } from '../components/VistaImagen';

import { opcionesArea, opcionesProceso, opcionesActividad, opcionesPeligro, opcionesAgenteMaterial, opcionesRiesgo, opcionesMedidas, Area } from '../utils/opcionesPlanificaciones';

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

  const estilos = useEstilosPantalla();

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
      }
    };
    cargarPlanificacion();
  }, []);

  const guardarCambios = async () => {
    const ref = doc(db, 'planificaciones', planificacionId);
    const payload = {
      area,
      proceso,
      actividad,
      peligro,
      agenteMaterial,
      riesgo,
      medidas,
      fechaModificacion: new Date().toISOString(),
    };

    try {
      await updateDoc(ref, payload);
      setAlertaMensaje('✅ Cambios guardados correctamente');
      setAlertaVisible(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      setAlertaMensaje('❌ Error al guardar los cambios');
      setAlertaVisible(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        contentInset={{ bottom: 40 }}
      >
        <Text style={estilos.planificacion.title}>Editar Planificación</Text>

        <FormPicker
          label="Área de Trabajo:"
          selectedValue={area}
          onValueChange={(nuevoArea) => {
            setArea(nuevoArea as Area);
            setPeligro([]);
          }}
          options={opcionesArea}
        />
        
        <Text style={estilos.planificacion.label}>Proceso:</Text>
        <SelectorMultipleChips
          titulo="Seleccionar proceso:"
          opciones={opcionesProceso[area] ?? []}
          seleccionados={proceso}
          setSeleccionados={setProceso}
          expandido={expandirProcesos}
          setExpandido={setExpandirProcesos}
        />

        <Text style={estilos.planificacion.label}>Actividad:</Text>
        <SelectorMultipleChips
          titulo="Seleccionar actividad:"
          opciones={opcionesActividad[area] ?? []}
          seleccionados={actividad}
          setSeleccionados={setActividad}
          expandido={expandirActividades}
          setExpandido={setExpandirActividades}
        />

        <Text style={estilos.planificacion.label}>Peligros:</Text>
        <SelectorMultipleChips
          titulo="Seleccionar peligros"
          opciones={opcionesPeligro[area] ?? []}
          seleccionados={peligro}
          setSeleccionados={setPeligro}
          expandido={expandirPeligros}
          setExpandido={setExpandirPeligros}
        />

        <Text style={estilos.planificacion.label}>Agente Material:</Text>
          <SelectorMultipleChips
            titulo="Seleccionar agente material:"
            opciones={opcionesAgenteMaterial[area] ?? []}
            seleccionados={agenteMaterial}
            setSeleccionados={setAgenteMaterial}
            expandido={expandirAgenteMaterial}
            setExpandido={setExpandirAgenteMaterial}
          />

        <Text style={estilos.planificacion.label}>Medidas de Control:</Text>
        <SelectorMultipleChips
          titulo="Seleccionar medidas"
          opciones={opcionesMedidas}
          seleccionados={medidas}
          setSeleccionados={setMedidas}
          expandido={expandirMedidas}
          setExpandido={setExpandirMedidas}
        />

        <FormPicker label="Riesgo" selectedValue={riesgo} onValueChange={setRiesgo} options={opcionesRiesgo} />

        <VistaImagen uri={imagen} setUri={setImagen} />

        <Button mode="contained" onPress={guardarCambios} style={estilos.planificacion.button}>
          Guardar Cambios
        </Button>
      </ScrollView>

      <Snackbar visible={alertaVisible} onDismiss={() => setAlertaVisible(false)} duration={3000}>
        {alertaMensaje}
      </Snackbar>
    </SafeAreaView>
  );
}