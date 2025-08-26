import { useEffect } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import {
    opcionesCargo, opcionesAccidente, opcionesLesion,
    opcionesPotencial, opcionesActividad, opcionesAQuienOcurrio, opcionesMedidas
} from '../utils/opciones';
import { FormPicker } from '../components/FormPicker';
import { useFormularioEvento } from '../hooks/useFormularioEvento';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';
import { CampoTexto } from '../components/CampoTexto';
import { SelectorFechaHora } from '../components/SelectorFechaHora';
import { SelectorMultipleChips } from '../components/SelectorMultipleChips';
import { SeccionClasificacion } from '../components/SeccionClasificacion';
import { VistaImagen } from '../components/VistaImagen';

export default function EditarReporteScreen() {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp<any>>();
    const { id: reporteId } = route.params as { id: string };

    const {
        cargo, setCargo,
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
        setearDatos, getPayload
    } = useFormularioEvento();

    const estilos = useEstilosPantalla();

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
            <ScrollView contentContainerStyle={estilos.comunes.scrollContent}
                contentInset={{ bottom: 40 }}
            >
                <Text style={estilos.reporte.title}>Editar Reporte</Text>

                <FormPicker label="Cargo" selectedValue={cargo} onValueChange={setCargo} options={opcionesCargo} />

                <View style={{ marginVertical: 10 }}>
                    {latitud && longitud ? (
                        <Text>📍 Ubicación: {latitud.toFixed(5)}, {longitud.toFixed(5)}</Text>
                    ) : (
                        <Text>Obteniendo ubicación...</Text>
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

                <Text style={estilos.reporte.subtitle}>Medidas de control:</Text>
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

                <Button mode="contained" onPress={guardarCambios} style={estilos.reporte.button}>
                    Guardar Cambios
                </Button>
            </ScrollView>

            <Snackbar visible={alertaVisible} onDismiss={() => setAlertaVisible(false)} duration={3000}>
                {alertaMensaje}
            </Snackbar>
        </SafeAreaView>
    );
}