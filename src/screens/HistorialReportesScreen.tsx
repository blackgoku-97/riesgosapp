import { SafeAreaView, ScrollView, StyleSheet, Alert, View, Image } from 'react-native';
import { Text, Card, Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

import { useNavigation, NavigationProp } from '@react-navigation/native';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { ReporteAcciones } from '../components/ReporteAcciones';

import { generarHTMLReporte } from '../utils/htmlUtils';
import { exportarExcelReporte } from '../utils/excelUtils';
import { convertirImagenDesdeURL } from '../utils/imagenUtils';

import { useReportes } from '../hooks/useReportes';
import { useLogoBase64 } from '../hooks/useLogoBase64';

import * as FileSystem from 'expo-file-system';

export default function HistorialReportesScreen() {

  const { reportes, cargando, cargarReportes } = useReportes();
  const logoBase64 = useLogoBase64();
  const navigation = useNavigation<NavigationProp<any>>();

  const eliminarReporte = async (id: string) => {
    Alert.alert(
      '¿Eliminar reporte?',
      'Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'reportes', id));
              await cargarReportes();
            } catch (error) {
              console.error('Error al eliminar reporte:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const exportarPDF = async (reporte: any) => {
    try {
      if (!logoBase64) {
        Alert.alert('Error', 'No se pudo cargar el logo institucional.');
        return;
      }

      const imagenBase64 = await convertirImagenDesdeURL(reporte.imagen);
      if (!imagenBase64) {
        Alert.alert('Error', 'No se pudo cargar la imagen del incidente.');
        return;
      }

      const html = generarHTMLReporte(reporte, logoBase64, imagenBase64);
      const { uri } = await Print.printToFileAsync({ html });

      if (!uri) {
        Alert.alert('Error', 'No se pudo generar el archivo PDF.');
        return;
      }

      // Copiar a una ruta accesible para Android
      const nuevoPath = `${FileSystem.documentDirectory}reporte_${reporte.id}.pdf`;
      await FileSystem.copyAsync({ from: uri, to: nuevoPath });

      await Sharing.shareAsync(nuevoPath);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      Alert.alert('Error', 'Ocurrió un problema al generar el PDF. Intenta nuevamente.');
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>

        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>

        <Text style={styles.title}>Historial de Reportes</Text>

        {cargando ? (
          <ActivityIndicator animating={true} size="large" style={{ marginTop: 40 }} color="#D32F2F" />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {reportes.length === 0 ? (
              <Text style={styles.emptyText}>No hay reportes registrados aún.</Text>
            ) : (
              reportes.map((reporte) => (
                <Card key={reporte.id} style={styles.card}>
                  <Card.Content>
                    <Text style={styles.cardTitle}>
                      {reporte.numeroReporte || `Reporte #${reporte.id.slice(-5)}`}
                    </Text>
                    <Text>Cargo: {reporte.cargo}</Text>
                    <Text>Zona: {reporte.zona}</Text>
                    {reporte.subZona ? <Text>Subzona: {reporte.subZona}</Text> : null}
                    <Text>Clasificación: {reporte.clasificacion}</Text>
                    <Text style={styles.fecha}>
                      Fecha:{' '}
                      {reporte.fechaReporteLocal ||
                        new Date(reporte.fechaReporte).toLocaleString('es-CL', {
                          timeZone: 'America/Santiago',
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                    </Text>
                  </Card.Content>
                  <ReporteAcciones
                    reporte={reporte}
                    onExportarExcel={() => exportarExcelReporte(reporte)}
                    onExportarPDF={() => exportarPDF(reporte)}
                    onEditar={(id) => navigation.navigate('Editar Reporte', { id })}
                    onEliminar={() => eliminarReporte(reporte.id)}
                  />
                </Card>
              ))
            )}
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