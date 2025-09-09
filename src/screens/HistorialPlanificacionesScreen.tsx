import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput, Text, Card, ActivityIndicator } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

import { PlanificacionAcciones } from '../components';
import { useLogoInstitucional, usePlanificacionesConAcciones, useFormularioPlanificacion } from '../hooks';
import { exportarCSVPlanificacion } from '../utils';

export default function HistorialPlanificacionesScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { planificaciones, cargando, eliminarPlanificacion, exportarPDF } = usePlanificacionesConAcciones();
  const { anioSeleccionado, setAnioSeleccionado } = useFormularioPlanificacion();
  const { logoUri } = useLogoInstitucional();

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
            <Card
              key={item.id}
              className="mb-4 bg-institucional-blanco dark:bg-neutral-800 shadow-md rounded-lg"
            >
              <Card.Content>
                <Text className="font-semibold text-lg mb-1">{item.numeroPlanificacion}</Text>
                <Text>📅 Fecha: {item.fecha}</Text>
                <Text>📌 Plan de trabajo: {item.planTrabajo}</Text>

                {item.latitud && item.longitud ? (
                  <>
                    <View style={{ height: 180, marginVertical: 8 }}>
                      <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                          latitude: item.latitud,
                          longitude: item.longitud,
                          latitudeDelta: 0.001,
                          longitudeDelta: 0.001,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={true}
                      >
                        <Marker
                          coordinate={{
                            latitude: item.latitud,
                            longitude: item.longitud,
                          }}
                          title="Ubicación de la planificación"
                        />
                      </MapView>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        const url = `https://www.google.com/maps/search/?api=1&query=${item.latitud},${item.longitud}`;
                        Linking.openURL(url);
                      }}
                    >
                      <Text className="text-blue-600 underline">
                        📍 Abrir en Google Maps
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text>📍 Ubicación: Sin datos de ubicación</Text>
                )}

                <Text>📍 Área: {item.area}</Text>
                <Text>🔄 Proceso: {item.proceso}</Text>
                <Text>🔧 Actividad: {item.actividad}</Text>
                <Text>
                  ⚠️ Peligros: {Array.isArray(item.peligro) ? item.peligro.join(', ') : item.peligro ?? '—'}
                </Text>
                <Text>🧪 Agente Material: {item.agenteMaterial}</Text>
                <Text>
                  🛡️ Medidas: {Array.isArray(item.medidas) ? item.medidas.join(', ') : item.medidas ?? '—'}
                </Text>
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