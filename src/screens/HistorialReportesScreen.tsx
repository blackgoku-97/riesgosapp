import { SafeAreaView, ScrollView, Alert, View, Image } from 'react-native';
import { TextInput, Text, Card, ActivityIndicator } from 'react-native-paper';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

import { useNavigation, NavigationProp } from '@react-navigation/native';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { ReporteAcciones } from '../components/ReporteAcciones';

import { generarHTMLReporte } from '../utils/htmlUtils';
import { exportarCSVReporte } from '../utils/excelUtils';
import { convertirImagenDesdeURL } from '../utils/imagenUtils';

import { useReportes } from '../hooks/useReportes';
import { useLogoBase64 } from '../hooks/useLogoBase64';
import { useFormularioEvento } from '../hooks/useFormularioEvento';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';

import * as FileSystem from 'expo-file-system';

export default function HistorialReportesScreen() {
  const { reportes, cargando, cargarReportes } = useReportes();
  const { anioSeleccionado, setAnioSeleccionado } = useFormularioEvento();
  const estilos = useEstilosPantalla();
  const { logoBase64, isLoading, error } = useLogoBase64();
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
      if (isLoading) {
        Alert.alert('Logo en proceso', 'Espera a que se cargue el logo institucional.');
        return;
      }

      if (!logoBase64 || error) {
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

      const nuevoPath = `${FileSystem.documentDirectory}reporte_${reporte.id}.pdf`;
      await FileSystem.copyAsync({ from: uri, to: nuevoPath });

      await Sharing.shareAsync(nuevoPath);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      Alert.alert('Error', 'Ocurrió un problema al generar el PDF. Intenta nuevamente.');
    }
  };

  const reportesFiltrados = anioSeleccionado
    ? reportes.filter((r) => new Date(r.fechaReporte).getFullYear() === anioSeleccionado)
    : reportes;

  return (
    <SafeAreaView style={estilos.historialReportes.container}>
      <View style={estilos.historialReportes.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={estilos.historialReportes.logo} />
      </View>

      <Text style={estilos.historialReportes.title}>Historial de Reportes</Text>

      <TextInput
        label="Filtrar por año"
        value={anioSeleccionado?.toString() || ''}
        onChangeText={(texto) => {
          const anio = parseInt(texto);
          if (!isNaN(anio)) setAnioSeleccionado(anio);
          else setAnioSeleccionado(null);
        }}
        keyboardType="numeric"
        mode="outlined"
        style={{ marginBottom: 20 }}
      />

      {cargando ? (
        <ActivityIndicator animating={true} size="large" style={{ marginTop: 40 }} color="#D32F2F" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.historialReportes.scrollContent}>
          {reportesFiltrados.length === 0 ? (
            <Text style={estilos.historialReportes.emptyText}>
              {anioSeleccionado
                ? `No hay reportes registrados para el año ${anioSeleccionado}.`
                : 'No hay reportes registrados aún.'}
            </Text>
          ) : (
            reportesFiltrados.map((reporte) => (
              <Card key={reporte.id} style={estilos.historialReportes.card}>
                <Card.Content>
                  <View style={estilos.historialReportes.reporteHeader}>
                    <Text style={estilos.historialReportes.cardTitle}>
                      {reporte.numeroReporte || `Reporte #${reporte.id.slice(-5)}`}
                    </Text>
                    <Text style={estilos.historialReportes.fecha}>
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
                  </View>

                  <View style={estilos.historialReportes.reporteDetalles}>
                    <Text>Cargo: {reporte.cargo}</Text>
                    <Text>Zona: {reporte.zona}</Text>
                    {reporte.subZona && <Text>Subzona: {reporte.subZona}</Text>}
                    <Text>Lugar: {reporte.lugarEspecifico}</Text>
                    <Text>Fecha del incidente: {reporte.fechaReporteLocal}</Text>
                    <Text>Tipo de accidente: {reporte.tipoAccidente}</Text>
                    {reporte.tipoAccidente !== 'Cuasi Accidente' && <Text>Lesión: {reporte.lesion}</Text>}
                    <Text>Actividad: {reporte.actividad}</Text>
                    <Text>Clasificación: {reporte.clasificacion}</Text>

                    {reporte.clasificacion === 'Acción Insegura' ? (
                      <Text>Acciones Inseguras: {reporte.accionesSeleccionadas?.join(', ')}</Text>
                    ) : reporte.clasificacion === 'Condición Insegura' ? (
                      <Text>Condiciones Inseguras: {reporte.condicionesSeleccionadas?.join(', ')}</Text>
                    ) : (
                      <>
                        <Text>Acciones Inseguras: {reporte.accionesSeleccionadas?.join(', ')}</Text>
                        <Text>Condiciones Inseguras: {reporte.condicionesSeleccionadas?.join(', ')}</Text>
                      </>
                    )}

                    <Text>Potencial: {reporte.potencial}</Text>
                    <Text>Medidas de control: {reporte.medidasSeleccionadas?.join(', ')}</Text>
                    <Text>Afectado: {reporte.quienAfectado}</Text>
                    <Text>Descripción: {reporte.descripcion}</Text>

                    {reporte.imagen && (
                      <Image
                        source={{ uri: reporte.imagen }}
                        style={{ width: '100%', height: 200, marginTop: 10, borderRadius: 6 }}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </Card.Content>

                <View style={estilos.historialReportes.actions}>
                  <ReporteAcciones
                    reporte={reporte}
                    onExportarExcel={() => exportarCSVReporte(reporte)}
                    onExportarPDF={() => exportarPDF(reporte)}
                    onEditar={(id) => navigation.navigate('Editar Reporte', { id })}
                    onEliminar={() => eliminarReporte(reporte.id)}
                  />
                </View>
              </Card>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}