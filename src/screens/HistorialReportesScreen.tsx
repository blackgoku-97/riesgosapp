import {
  ScrollView,
  View,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Text, Card, ActivityIndicator } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

import { ReporteAcciones } from '../components';
import {
  useLogoInstitucional,
  useFormularioEvento,
  useReportesConAcciones,
} from '../hooks';

import { exportarCSVReporte } from '../utils';

export default function HistorialReportesScreen() {
  const { reportes, normalizar, cargando, eliminarReporte, exportarPDF, formatoFecha } =
    useReportesConAcciones();
  const { cargo, anioSeleccionado, setAnioSeleccionado } = useFormularioEvento();
  const navigation = useNavigation<NavigationProp<any>>();
  const { logoUri } = useLogoInstitucional();

  const reportesFiltrados = anioSeleccionado
    ? reportes.filter(
        (r) => new Date(r.fechaReporte).getFullYear() === anioSeleccionado
      )
    : reportes;

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
          const anio = parseInt(texto, 10);
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
                      Fecha:{' '}
                      {reporte.fechaReporteLocal ||
                        formatoFecha(reporte.fechaReporte)}
                    </Text>
                  </View>

                  <View className="space-y-1">
                    <Text>Cargo: {reporte.cargo}</Text>

                    {reporte.latitud && reporte.longitud ? (
                      <>
                        <View style={{ height: 180, marginVertical: 8 }}>
                          <MapView
                            style={{ flex: 1 }}
                            initialRegion={{
                              latitude: reporte.latitud,
                              longitude: reporte.longitud,
                              latitudeDelta: 0.001,
                              longitudeDelta: 0.001,
                            }}
                            scrollEnabled={false}
                            zoomEnabled={true}
                          >
                            <Marker
                              coordinate={{
                                latitude: reporte.latitud,
                                longitude: reporte.longitud,
                              }}
                              title="Ubicación del incidente"
                            />
                          </MapView>
                        </View>

                        <TouchableOpacity
                          onPress={() => {
                            const url = `https://www.google.com/maps/search/?api=1&query=${reporte.latitud},${reporte.longitud}`;
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

                    <Text>Lugar: {reporte.lugarEspecifico}</Text>
                    <Text>
                      Fecha del incidente:{' '}
                      {formatoFecha(reporte.fechaReporte)}
                    </Text>
                    <Text>Afectado: {reporte.quienAfectado}</Text>
                    <Text>Tipo de accidente: {reporte.tipoAccidente}</Text>
                    {reporte.tipoAccidente !== 'Cuasi Accidente' && (
                      <Text>Lesión: {reporte.lesion}</Text>
                    )}
                    <Text>Actividad: {reporte.actividad}</Text>
                    <Text>Clasificación: {reporte.clasificacion}</Text>

                    {reporte.clasificacion === 'Acción Insegura' ? (
                      <Text>
                        Acciones Inseguras:{' '}
                        {reporte.accionesSeleccionadas?.join(', ')}
                      </Text>
                    ) : reporte.clasificacion === 'Condición Insegura' ? (
                      <Text>
                        Condiciones Inseguras:{' '}
                        {reporte.condicionesSeleccionadas?.join(', ')}
                      </Text>
                    ) : (
                      <>
                        <Text>
                          Acciones Inseguras:{' '}
                          {reporte.accionesSeleccionadas?.join(', ')}
                        </Text>
                        <Text>
                          Condiciones Inseguras:{' '}
                          {reporte.condicionesSeleccionadas?.join(', ')}
                        </Text>
                      </>
                    )}

                    {normalizar(reporte.cargo) ===
                      'encargado de prevencion de riesgos' && (
                      <>
                        <Text>Frecuencia: {reporte.frecuencia}</Text>
                        <Text>Severidad: {reporte.severidad}</Text>
                        <Text>Potencial: {reporte.potencial}</Text>
                      </>
                    )}

                    <Text>
                      Medidas de control:{' '}
                      {reporte.medidasSeleccionadas?.join(', ')}
                    </Text>
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
                    onEditar={
                      normalizar(cargo) ===
                      'encargado de prevencion de riesgos'
                        ? (id) =>
                            navigation.navigate('Editar Reporte', { id })
                        : undefined
                    }
                    onEliminar={
                      normalizar(cargo) ===
                      'encargado de prevencion de riesgos'
                        ? () =>
                            eliminarReporte(
                              reporte.id,
                              reporte.deleteToken
                            )
                        : undefined
                    }
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