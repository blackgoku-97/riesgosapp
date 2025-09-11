import { Alert } from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { useReportes } from './useReportes';
import { useFormularioEvento } from './useFormularioEvento';
import { useLogoInstitucional } from './useLogoInstitucional';
import { convertirImagenDesdeURL, generarHTMLReporte } from '../utils';

export function useReportesConAcciones() {
  const { reportes, cargando, cargarReportes } = useReportes();
  const { anioSeleccionado } = useFormularioEvento();
  const { logoBase64, isLoading: loadingLogo, error: logoError } = useLogoInstitucional();

  const eliminarReporte = async (id: string, deleteToken?: string) => {
    Alert.alert('¿Eliminar reporte?', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            if (deleteToken) {
              await fetch(`https://api.cloudinary.com/v1_1/dw8ixfrxq/delete_by_token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: deleteToken }),
              });
            }
            await deleteDoc(doc(db, 'reportes', id));
            await cargarReportes();
          } catch (error) {
            console.error('Error al eliminar reporte o imagen:', error);
            Alert.alert('Error', 'Ocurrió un problema al eliminar el reporte.');
          }
        },
      },
    ]);
  };

  const exportarPDF = async (reporte: any) => {
    try {
      if (loadingLogo) {
        Alert.alert('Logo en proceso', 'Espera a que se cargue el logo institucional.');
        return;
      }
      if (!logoBase64 || logoError) {
        Alert.alert('Error', 'No se pudo cargar el logo institucional.');
        return;
      }
      if (!logoBase64?.startsWith('data:image') || logoBase64.length < 100) {
        Alert.alert('Error', 'El logo institucional no se cargó correctamente.');
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

  const formatoFecha = (fecha: string) =>
    new Date(fecha).toLocaleString('es-CL', {
      timeZone: 'America/Santiago',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const normalizar = (s?: string) =>
    (s ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim();

  return {
    reportes: reportesFiltrados,
    cargando,
    eliminarReporte,
    exportarPDF,
    formatoFecha,
    normalizar,
  };
}