import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, PaperProvider, ActivityIndicator } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { PlanificacionAcciones } from '../components/PlanificacionAcciones';

import { exportarExcelPlanificacion } from '../utils/excelUtils';
import { generarHTMLPlanificacion } from '../utils/htmlUtils';

import { useLogoBase64 } from '../hooks/useLogoBase64';
import { usePlanificaciones } from '../hooks/usePlanificaciones';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { db } from '../config/firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';

export default function HistorialPlanificacionesScreen() {

    const navigation = useNavigation<NavigationProp<any>>();
    const logoBase64 = useLogoBase64();
    const { planificaciones, cargando, cargarPlanificaciones } = usePlanificaciones();

    const eliminarPlanificacion = async (id: string) => {
        Alert.alert(
            '¿Eliminar planificación?',
            'Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'planificaciones', id));
                            await cargarPlanificaciones();
                        } catch (error) {
                            console.error('Error al eliminar planificación:', error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const exportarPDF = async (planificacion: any) => {
        if (!logoBase64) return;

        const html = generarHTMLPlanificacion(planificacion, logoBase64);
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri);
    };

    return (
        <PaperProvider>
            <SafeAreaView style={styles.container}>

                <View style={styles.logoContainer}>
                    <Image source={require('../assets/logo.png')} style={styles.logo} />
                </View>

                <Text style={styles.title}>📋 Historial de Planificaciones</Text>

                {cargando ? (
                    <ActivityIndicator size="large" color="#D32F2F" style={{ marginTop: 40 }} />
                ) : planificaciones.length === 0 ? (
                    <Text style={styles.emptyText}>No hay planificaciones registradas aún.</Text>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {planificaciones.map((item) => (
                            <Card key={item.id} style={styles.card}>
                                <Card.Content>
                                    <Text style={styles.cardTitle}>{item.numeroPlanificacion}</Text>
                                    <Text>📅 Fecha: {item.fecha}</Text>
                                    <Text>📌 Plan de trabajo: {item.planTrabajo}</Text>
                                    <Text>📍 Área: {item.area}</Text>
                                    <Text>🔄 Proceso: {item.proceso}</Text>
                                    <Text>🔧 Actividad: {item.actividad}</Text>
                                    <Text>⚠️ Peligros: {Array.isArray(item.peligro) ? item.peligro.join(', ') : item.peligro ?? '—'}</Text>
                                    <Text>🧪 Agente Material: {item.agenteMaterial}</Text>
                                    <Text>🛡️ Medidas: {Array.isArray(item.medidas) ? item.medidas.join(', ') : item.medidas ?? '—'}</Text>
                                    <Text>📉 Riesgo: {item.riesgo}</Text>
                                </Card.Content>

                                <PlanificacionAcciones
                                    planificacion={item}
                                    onExportarPDF={() => exportarPDF(item)}
                                    onExportarExcel={() => exportarExcelPlanificacion(item)}
                                    onEditar={(id) => navigation.navigate('Editar Planificacion', { id })}
                                    onEliminar={() => eliminarPlanificacion(item.id)}
                                />
                            </Card>
                        ))}
                    </ScrollView>
                )}
            </SafeAreaView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    logoContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    logo: {
        width: 80,
        height: 40,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D32F2F',
        textAlign: 'center',
        marginBottom: 20,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
        color: '#555',
    },
    card: {
        marginBottom: 20,
        backgroundColor: '#F9F9F9',
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#000',
    },
    fecha: {
        marginTop: 4,
        fontStyle: 'italic',
        color: '#555',
    },
    actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'flex-start',
        paddingBottom: 8,
    },
    actionButton: {
        minWidth: 140,
        flexGrow: 1,
    },
});