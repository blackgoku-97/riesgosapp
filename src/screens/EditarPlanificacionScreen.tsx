import { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

import useFormularioPlanificacion from '../hooks/useFormularPlanificacion';
import FormPicker from '../components/FormPicker';
import SelectorMultipleChips from '../components/SelectorMultipleChips';
import { opcionesArea, opcionesProceso, opcionesActividad, opcionesPeligro, opcionesAgenteMaterial, opcionesRiesgo, opcionesMedidas, Area } from '../utils/opcionesPlanificaciones';
import VistaImagen from '../components/VistaImagen';

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
    expandirPeligros, setExpandirPeligros,
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
        <Text style={styles.title}>Editar Planificación</Text>

        <FormPicker
          label="Área de Trabajo:"
          selectedValue={area}
          onValueChange={(nuevoArea) => {
            setArea(nuevoArea as Area);
            setPeligro([]);
          }}
          options={opcionesArea}
        />
        <FormPicker label="Proceso" selectedValue={proceso} onValueChange={setProceso} options={opcionesProceso} />
        <FormPicker label="Actividad" selectedValue={actividad} onValueChange={setActividad} options={opcionesActividad} />

        <Text style={styles.subtitle}>Peligros:</Text>
        <SelectorMultipleChips
          titulo="Seleccionar peligros"
          opciones={opcionesPeligro[area] ?? []}
          seleccionados={peligro}
          setSeleccionados={setPeligro}
          expandido={expandirPeligros}
          setExpandido={setExpandirPeligros}
        />

        <FormPicker label="Agente Material" selectedValue={agenteMaterial} onValueChange={setAgenteMaterial} options={opcionesAgenteMaterial} />

        <Text style={styles.subtitle}>Medidas de Control:</Text>
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

        <Button mode="contained" onPress={guardarCambios} style={styles.button}>
          Guardar Cambios
        </Button>
      </ScrollView>

      <Snackbar visible={alertaVisible} onDismiss={() => setAlertaVisible(false)} duration={3000}>
        {alertaMensaje}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#D32F2F',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  button: {
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 20,
  },
});