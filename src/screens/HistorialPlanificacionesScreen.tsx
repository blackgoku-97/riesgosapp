import { Alert, Image, SafeAreaView, ScrollView, View } from 'react-native';
import { TextInput, Text, Card, ActivityIndicator } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { PlanificacionAcciones } from '../components';

import { exportarCSVPlanificacion } from '../utils/excelUtils';
import { generarHTMLPlanificacion } from '../utils/htmlUtils';
import { convertirImagenDesdeURL } from '../utils/imagenUtils';

import {
  useLogoInstitucional,
  usePlanificaciones,
  useFormularioPlanificacion,
  useEstilosPantalla
} from '../hooks';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { db } from '../services/firebase';
import { deleteDoc, doc } from 'firebase/firestore';


export default function HistorialPlanificacionesScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { planificaciones, cargando, cargarPlanificaciones } = usePlanificaciones();
  const { anioSeleccionado, setAnioSeleccionado } = useFormularioPlanificacion();
  const estilos = useEstilosPantalla();

  const { logoUri, logoBase64, isLoading: loadingLogo, error: logoError } = useLogoInstitucional();

  const eliminarPlanificacion = async (id: string, deleteToken?: string) => {
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
              // 1️⃣ Borra primero en Cloudinary si hay token
              if (deleteToken) {
                await fetch(`https://api.cloudinary.com/v1_1/dw8ixfrxq/delete_by_token`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: deleteToken }),
                });
              }
              // 2️⃣ Luego borra en Firestore
              await deleteDoc(doc(db, 'planificaciones', id));
              await cargarPlanificaciones();
            } catch (error) {
              console.error('Error al eliminar planificación o imagen:', error);
              Alert.alert('Error', 'Ocurrió un problema al eliminar la planificación.');
            }
          },
        },
      ],
      { cancelable: true }
    );
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
    <SafeAreaView style={estilos.historialPlanificaciones.container}>
      <View style={estilos.historialPlanificaciones.logoContainer}>
        {logoUri ? (
          <Image
            source={{ uri: logoUri }}
            style={estilos.historialPlanificaciones.logo}
            resizeMode="contain"
          />
        ) : (
          <ActivityIndicator size="small" color="#D32F2F" />
        )}
      </View>

      <Text style={estilos.historialPlanificaciones.title}>📋 Historial de Planificaciones</Text>

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
        <Text style={estilos.historialPlanificaciones.emptyText}>No hay planificaciones registradas aún.</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.historialPlanificaciones.scrollContent}>
          {planificaciones.map((item) => (
            <Card key={item.id} style={estilos.historialPlanificaciones.card}>
              <Card.Content>
                <Text style={estilos.historialPlanificaciones.cardTitle}>{item.numeroPlanificacion}</Text>
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
                    style={estilos.historialPlanificaciones.imagen}
                  />
                )}
              </Card.Content>

              <PlanificacionAcciones
                planificacion={item}
                onExportarPDF={() => exportarPDF(item)}
                onExportarExcel={() => exportarCSVPlanificacion(item)}
                onEditar={(id) => navigation.navigate('Editar Planificacion', { id })}
                onEliminar={() => eliminarPlanificacion(item.id, item.deleteToken)}
              />
            </Card>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}