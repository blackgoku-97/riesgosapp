import { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import {
    opcionesCargo, opcionesZona, opcionesSubZona, opcionesAccidente, opcionesLesion,
    opcionesPotencial, opcionesActividad, opcionesAQuienOcurrio, opcionesMedidas
} from '../utils/opciones';
import FormPicker from '../components/FormPicker';
import useFormularioEvento from '../hooks/useFormularioEvento';
import CampoTexto from '../components/CampoTexto';
import SelectorFechaHora from '../components/SelectorFechaHora';
import SelectorMultipleChips from '../components/SelectorMultipleChips';
import SeccionClasificacion from '../components/SeccionClasificacion';
import VistaImagen from '../components/VistaImagen';

export default function EditarReporteScreen() {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp<any>>();
    const { id: reporteId } = route.params as { id: string };

    const {
        cargo, setCargo,
        zona, setZona,
        subZona, setSubZona,
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
        setearDatos, getPayload
    } = useFormularioEvento();

    const mostrarSubZona = zona === 'Taller' || zona === 'Oficina';

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

    const guardarCambios = async () => {
        const ref = doc(db, 'reportes', reporteId);
        const payload = getPayload();

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
                <Text style={styles.title}>Editar Reporte</Text>

                <FormPicker label="Cargo" selectedValue={cargo} onValueChange={setCargo} options={opcionesCargo} />
                <FormPicker label="Zona" selectedValue={zona} onValueChange={setZona} options={opcionesZona} />
                {mostrarSubZona && (
                    <FormPicker
                        label="Subzona:"
                        selectedValue={subZona}
                        onValueChange={setSubZona}
                        options={opcionesSubZona[zona] || []}
                    />
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

                <FormPicker label="Tipo de Accidente" selectedValue={tipoAccidente} onValueChange={setTipoAccidente} options={opcionesAccidente} />
                {tipoAccidente !== 'Cuasi Accidente' && (
                    <FormPicker label="Lesión" selectedValue={lesion} onValueChange={setLesion} options={opcionesLesion} />
                )}
                <FormPicker label="Actividad" selectedValue={actividad} onValueChange={setActividad} options={opcionesActividad} />

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

                <FormPicker label="Potencial" selectedValue={potencial} onValueChange={setPotencial} options={opcionesPotencial} />

                <Text style={styles.subtitle}>Medidas de control:</Text>
                <SelectorMultipleChips
                    titulo="Medidas de control aplicadas:"
                    opciones={opcionesMedidas}
                    seleccionados={medidasSeleccionadas}
                    setSeleccionados={setMedidasSeleccionadas}
                    expandido={expandirMedidas}
                    setExpandido={setExpandirMedidas}
                />

                <FormPicker label="¿A quién ocurrió?" selectedValue={quienAfectado} onValueChange={setQuienAfectado} options={opcionesAQuienOcurrio} />

                <CampoTexto
                    label="Descripción"
                    value={descripcion}
                    onChangeText={setDescripcion}
                    placeholder="Describe el incidente"
                    multiline
                />

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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 6,
        height: 100,
        textAlignVertical: 'top',
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#D32F2F',
        paddingVertical: 10,
        borderRadius: 6,
        marginTop: 20,
    },
});