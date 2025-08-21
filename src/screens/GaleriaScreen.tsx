import { SafeAreaView, ScrollView, Image, View } from 'react-native';
import { Text, Button, SegmentedButtons } from 'react-native-paper';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';
import { useEffect, useState } from 'react';
import {
  obtenerTodasLasImagenes,
  ImagenDocumento,
  eliminarImagenYDocumento,
} from '../services/cloudinaryService';

export default function GaleriaScreen() {
  const estilos = useEstilosPantalla();
  const [imagenes, setImagenes] = useState<ImagenDocumento[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'planificacion' | 'reporte'>('todos');

  useEffect(() => {
    const cargarImagenes = async () => {
      const datos = await obtenerTodasLasImagenes();
      setImagenes(datos);
    };
    cargarImagenes();
  }, []);

  const handleEliminar = async (
    token: string,
    docId: string,
    tipo: 'planificacion' | 'reporte',
    index: number
  ) => {
    const ok = await eliminarImagenYDocumento(token, docId, tipo === 'reporte' ? 'reportes' : 'planificaciones');
    if (ok) {
      setImagenes(prev => prev.filter((_, i) => i !== index));
    }
  };

  const imagenesFiltradas = imagenes.filter(img =>
    filtroTipo === 'todos' ? true : img.tipo === filtroTipo
  );

  return (
    <SafeAreaView style={estilos.comunes.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={estilos.acciones.title}>🖼️ Galería de Imágenes</Text>

        <SegmentedButtons
          value={filtroTipo}
          onValueChange={setFiltroTipo}
          buttons={[
            { value: 'todos', label: 'Todos' },
            { value: 'planificacion', label: 'Planificaciones' },
            { value: 'reporte', label: 'Reportes' },
          ]}
          style={{ marginBottom: 16 }}
        />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          {imagenesFiltradas.map((img, index) => (
            <View key={index} style={{ alignItems: 'center', width: 130 }}>
              <Image source={{ uri: img.url }} style={{ width: 120, height: 120, borderRadius: 8 }} />
              <Text style={{ fontSize: 12, marginTop: 4 }}>{img.area}</Text>
              <Text style={{ fontSize: 11, color: '#555' }}>
                {Array.isArray(img.actividad) ? img.actividad.join(', ') : 'Sin actividad'}
              </Text>
              <Text style={{ fontSize: 11, color: '#999' }}>{img.fecha}</Text>
              <Text style={{ fontSize: 10, color: '#1976D2' }}>
                {img.tipo === 'reporte' ? '📋 Reporte' : '🗓️ Planificación'}
              </Text>
              {img.deleteToken && img.docId && (
                <Button
                  icon="delete"
                  mode="text"
                  compact
                  onPress={() => handleEliminar(img.deleteToken!, img.docId!, img.tipo, index)}
                  labelStyle={{ fontSize: 12, color: '#D32F2F' }}
                >
                  Eliminar
                </Button>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}