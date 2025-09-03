import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import { TextInput, Text, Card, ActivityIndicator } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { PlanificacionAcciones } from '../components';

import {
  useLogoInstitucional,
  usePlanificaciones,
  useFormularioPlanificacion,
} from '../hooks';

import {
  exportarCSVPlanificacion,
  generarHTMLPlanificacion,
  convertirImagenDesdeURL,
} from '../utils';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { db } from '../services/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export default function HistorialPlanificacionesScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { planificaciones, cargando, cargarPlanificaciones } = usePlanificaciones();
  const { anioSeleccionado, setAnioSeleccionado } = useFormularioPlanificacion();
  const { logoUri, logoBase64, isLoading: loadingLogo, error: logoError } = useLogoInstitucional();

  const eliminarPlanificacion = async (id: string, deleteToken?: string) => {
    Alert.alert('¿Eliminar planificación?', 'Esta acción no se puede deshacer.', [
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
      if (loadingLogo) {
        Alert.alert('Logo en proceso', 'Espera a que se cargue el logo institucional.');
        return;
      }

      if (!logoBase64 || logoError) {
        Alert.alert('Error', 'No se pudo cargar el logo institucional.');
        return;
      }

      const imagenBase64 = await convertirImagenDesdeURL(planificacion.imagen);
      if (!imagenBase64) {
        Alert.alert('Error', 'No se pudo cargar la imagen del incidente.');
        return;
      }

      const html = generarHTMLPlanificacion(planificacion, logoBase64, imagenBase64);
      const { uri } = await Print.printToFileAsync({ html });

      if (!uri) {
        Alert.alert('Error', 'No se pudo generar el archivo PDF.');
        return;
      }

      const nuevoPath = `${FileSystem.documentDirectory}planificacion_${planificacion.id}.pdf`;
      await FileSystem.copyAsync({ from: uri, to: nuevoPath });

      await Sharing.shareAsync(nuevoPath);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      Alert.alert('Error', 'Ocurrió un problema al generar el PDF. Intenta nuevamente.');
    }
  };

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

      <Text className="text-xl font-bold text-institucional-rojo text-center mb-4">
        📋 Historial de Planificaciones
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
        <ActivityIndicator animating size="large" color="#D32F2F" style={{ marginTop: 40 }} />
      ) : planificaciones.length === 0 ? (
        <Text className="text-center text-neutral-500 dark:text-neutral-300 mt-4">
          No hay planificaciones registradas aún.
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {planificaciones.map((item) => (
            <Card key={item.id} className="mb-4 bg-institucional-blanco dark:bg-neutral-800 shadow-md rounded-lg">
              <Card.Content>
                <Text className="font-semibold text-lg mb-1">{item.numeroPlanificacion}</Text>
                <Text>📅 Fecha: {item.fecha}</Text>
                <Text>📌 Plan de trabajo: {item.planTrabajo}</Text>
                <Text>📍 Área: {item.area}</Text>
                <Text>🔄 Proceso: {item.proceso}</Text>
                <Text>🔧 Actividad: {item.actividad}</Text>
                <Text>⚠️ Peligros: {Array.isArray(item.peligro) ? item.peligro.join(', ') : item.peligro ?? '—'}</Text>
                <Text>🧪 Agente Material: {item.agenteMaterial}</Text>
                <Text>🛡️ Medidas: {Array.isArray(item.medidas) ? item.medidas.join(', ') : item.medidas ?? '—'}</Text>
                <Text>📉 Riesgo: {item.riesgo}</Text>

                {item.imagen && (
                  <Image
                    source={{ uri: item.imagenCloudinaryURL || item.imagen }}
                    className="w-full h-52 mt-2 rounded-md"
                    resizeMode="cover"
                  />
                )}
              </Card.Content>

              <View className="px-4 pb-4">
                <PlanificacionAcciones
                  planificacion={item}
                  onExportarPDF={() => exportarPDF(item)}
                  onExportarExcel={() => exportarCSVPlanificacion(item)}
                  onEditar={(id) => navigation.navigate('Editar Planificacion', { id })}
                  onEliminar={() => eliminarPlanificacion(item.id, item.deleteToken)}
                />
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}