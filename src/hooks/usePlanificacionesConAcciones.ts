import { Alert } from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { usePlanificaciones } from './usePlanificaciones';
import { useLogoInstitucional } from './useLogoInstitucional';
import { convertirImagenDesdeURL, generarHTMLPlanificacion } from '../utils';

export function usePlanificacionesConAcciones() {
  const { planificaciones, cargando, cargarPlanificaciones } = usePlanificaciones();
  const { logoBase64, isLoading: loadingLogo, error: logoError } = useLogoInstitucional();

  const eliminarPlanificacion = (id: string, deleteToken?: string) => {
    Alert.alert('¿Eliminar planificación?', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            if (deleteToken) {
              await fetch('https://api.cloudinary.com/v1_1/dw8ixfrxq/delete_by_token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: deleteToken }),
              });
            }
            await deleteDoc(doc(db, 'planificaciones', id));
            await cargarPlanificaciones();
          } catch (error) {
            console.error('Error al eliminar planificación o imagen:', error);
            Alert.alert('Error', 'Ocurrió un problema al eliminar la planificación.');
          }
        },
      },
    ]);
  };

  const exportarPDF = async (planificacion: any) => {
    try {
      if (loadingLogo) return Alert.alert('Logo en proceso', 'Espera a que se cargue el logo institucional.');
      if (!logoBase64 || logoError) return Alert.alert('Error', 'No se pudo cargar el logo institucional.');
      if (!logoBase64?.startsWith('data:image') || logoBase64.length < 100)
        return Alert.alert('Error', 'El logo institucional no se cargó correctamente.');

      const imagenBase64 = await convertirImagenDesdeURL(planificacion.imagen);
      if (!imagenBase64) return Alert.alert('Error', 'No se pudo cargar la imagen de la actividad.');

      const html = generarHTMLPlanificacion(planificacion, logoBase64, imagenBase64);
      const { uri } = await Print.printToFileAsync({ html });
      if (!uri) return Alert.alert('Error', 'No se pudo generar el archivo PDF.');

      const nuevoPath = `${FileSystem.documentDirectory}planificacion_${planificacion.id}.pdf`;
      await FileSystem.copyAsync({ from: uri, to: nuevoPath });
      await Sharing.shareAsync(nuevoPath);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      Alert.alert('Error', 'Ocurrió un problema al generar el PDF. Intenta nuevamente.');
    }
  };

  return { planificaciones, cargando, eliminarPlanificacion, exportarPDF };
}