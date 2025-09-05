import {
  SafeAreaView,
  ScrollView,
  Alert,
  View,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Text, Card, ActivityIndicator } from 'react-native-paper';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import { ReporteAcciones } from '../components';
import {
  useReportes,
  useLogoInstitucional,
  useFormularioEvento,
} from '../hooks';

import {
  generarHTMLReporte,
  exportarCSVReporte,
  convertirImagenDesdeURL,
} from '../utils';

export default function HistorialReportesScreen() {
  const { reportes, cargando, cargarReportes } = useReportes();
  const { anioSeleccionado, setAnioSeleccionado } = useFormularioEvento();
  const navigation = useNavigation<NavigationProp<any>>();
  const { logoUri, logoBase64, isLoading: loadingLogo, error: logoError } =
    useLogoInstitucional();

  const eliminarReporte = async (id: string, deleteToken?: string) => {
    Alert.alert('¿Eliminar reporte?', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            if (deleteToken) {
              await fetch(
                `https://api.cloudinary.com/v1_1/dw8ixfrxq/delete_by_token`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: deleteToken }),
                }
              );
            }

            await deleteDoc(doc(db, 'reportes', id));
            await cargarReportes();
          } catch (error) {
            console.error('Error al eliminar reporte o imagen:', error);
            Alert.alert(
              'Error',
              'Ocurrió un problema al eliminar el reporte.'
            );
          }
        },
      },
    ]);
  };

  const exportarPDF = async (reporte: any) => {
    try {
      if (loadingLogo) {
        Alert.alert(
          'Logo en proceso',
          'Espera a que se cargue el logo institucional.'
        );
        return;
      }

      if (!logoBase64 || logoError) {
        Alert.alert('Error', 'No se pudo cargar el logo institucional.');
        return;
      }

      if (
        !logoBase64?.startsWith('data:image') ||
        logoBase64.length < 100
      ) {
        Alert.alert(
          'Error',
          'El logo institucional no se cargó correctamente.'
        );
        return;
      }

      const imagenBase64 = await convertirImagenDesdeURL(reporte.imagen);
      if (!imagenBase64) {
        Alert.alert(
          'Error',
          'No se pudo cargar la imagen del incidente.'
        );
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
      Alert.alert(
        'Error',
        'Ocurrió un problema al generar el PDF. Intenta nuevamente.'
      );
    }
  };

  const reportesFiltrados = anioSeleccionado
    ? reportes.filter(
      (r) =>
        new Date(r.fechaReporte).getFullYear() === anioSeleccionado
    )
    : reportes;

  const formatoFecha = (fecha: string) =>
    new Date(fecha).toLocaleString('es-CL', {
      timeZone: 'America/Santiago',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <SafeAreaView className="flex-1 bg-institucional-blanco dark:bg-neutral-900 px-4">
      <View className="items-center my-4">
        {logoUri ? (
          <Image
            source={{ uri: logoUri }}
            className="w-48 h-16"
            resizeMode="contain"
          />
        ) : (
          <ActivityIndicator size="small" color="#D32F2F" />
        )}
      </View>

      <Text className="text-center text-xl font-bold text-institucional-rojo mb-4">
        Historial de Reportes
      </Text>

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
        <ActivityIndicator
          animating={true}
          size="large"
          style={{ marginTop: 40 }}
          color="#D32F2F"
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {reportesFiltrados.length === 0 ? (
            <Text className="text-center text-neutral-500 dark:text-neutral-300 mt-4">
              {anioSeleccionado
                ? `No hay reportes registrados para el año ${anioSeleccionado}.`
                : 'No hay reportes registrados aún.'}
            </Text>
          ) : (
            reportesFiltrados.map((reporte) => (
              <Card
                key={reporte.id}
                className="mb-4 bg-institucional-blanco dark:bg-neutral-800 shadow-md rounded-lg"
              >
                <Card.Content>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-semibold text-lg">
                      {reporte.numeroReporte ||
                        `Reporte #${reporte.id.slice(-5)}`}
                    </Text>
                    <Text className="text-sm text-neutral-600 dark:text-neutral-300">
                      Fecha: {reporte.fechaReporteLocal || formatoFecha(reporte.fechaReporte)}
                    </Text>
                  </View>

                  <View className="space-y-1">
                    <Text>Cargo: {reporte.cargo}</Text>
                    {reporte.latitud && reporte.longitud ? (
                      <TouchableOpacity
                        onPress={() => {
                          const url = `https://www.google.com/maps/search/?api=1&query=${reporte.latitud},${reporte.longitud}`;
                          Linking.openURL(url);
                        }}
                      >
                        <Text className="text-blue-600 underline">
                          📍 Ubicación: {reporte.latitud.toFixed(5)}, {reporte.longitud.toFixed(5)}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text>📍 Ubicación: Sin datos de ubicación</Text>
                    )}
                    <Text>Lugar: {reporte.lugarEspecifico}</Text>
                    <Text>Fecha del incidente: {formatoFecha(reporte.fechaReporte)}</Text>
                    <Text>Afectado: {reporte.quienAfectado}</Text>
                    <Text>Tipo de accidente: {reporte.tipoAccidente}</Text>
                    {reporte.tipoAccidente !== 'Cuasi Accidente' && (
                      <Text>Lesión: {reporte.lesion}</Text>
                    )}
                    <Text>Actividad: {reporte.actividad}</Text>
                    <Text>Clasificación: {reporte.clasificacion}</Text>

                    {reporte.clasificacion === 'Acción Insegura' ? (
                      <Text>
                        Acciones Inseguras: {reporte.accionesSeleccionadas?.join(', ')}
                      </Text>
                    ) : reporte.clasificacion === 'Condición Insegura' ? (
                      <Text>
                        Condiciones Inseguras: {reporte.condicionesSeleccionadas?.join(', ')}
                      </Text>
                    ) : (
                      <>
                        <Text>
                          Acciones Inseguras: {reporte.accionesSeleccionadas?.join(', ')}
                        </Text>
                        <Text>
                          Condiciones Inseguras: {reporte.condicionesSeleccionadas?.join(', ')}
                        </Text>
                      </>
                    )}

                    <Text>Potencial: {reporte.potencial}</Text>
                    <Text>Medidas de control: {reporte.medidasSeleccionadas?.join(', ')}</Text>
                    <Text>Descripción: {reporte.descripcion}</Text>

                    {reporte.imagen && (
                      <Image
                        source={{ uri: reporte.imagen }}
                        className="w-full h-52 mt-2 rounded-md"
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </Card.Content>

                <View className="mt-2 px-4 pb-4">
                  <ReporteAcciones
                    reporte={reporte}
                    onExportarExcel={() => exportarCSVReporte(reporte)}
                    onExportarPDF={() => exportarPDF(reporte)}
                    onEditar={(id) => navigation.navigate('Editar Reporte', { id })}
                    onEliminar={() => eliminarReporte(reporte.id, reporte.deleteToken)}
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