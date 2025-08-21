import { SafeAreaView, ScrollView, Image, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';
import { useEffect, useState } from 'react';
import {
  obtenerImagenesCloudinary,
  ImagenPlanificacion,
  eliminarImagenCloudinary,
} from '../services/cloudinaryService';

export default function GaleriaScreen() {
  const estilos = useEstilosPantalla();
  const [imagenes, setImagenes] = useState<ImagenPlanificacion[]>([]);

  useEffect(() => {
    const cargarImagenes = async () => {
      const datos = await obtenerImagenesCloudinary();
      console.log('Imagenes cargadas:', datos); // 👈 Verifica si deleteToken está presente
      setImagenes(datos);
    };
    cargarImagenes();
  }, []);

  const handleEliminar = async (token: string, index: number) => {
    const ok = await eliminarImagenCloudinary(token);
    if (ok) {
      setImagenes(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <SafeAreaView style={estilos.comunes.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={estilos.acciones.title}>🖼️ Galería de Imágenes</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          {imagenes.map((img, index) => (
            <View key={index} style={{ alignItems: 'center', width: 130 }}>
              <Image source={{ uri: img.url }} style={{ width: 120, height: 120, borderRadius: 8 }} />
              <Text style={{ fontSize: 12, marginTop: 4 }}>{img.area}</Text>
              <Text style={{ fontSize: 11, color: '#555' }}>{img.actividad.join(', ')}</Text>
              <Text style={{ fontSize: 11, color: '#999' }}>{img.fecha}</Text>
              {img.deleteToken && (
                <Button
                  icon="delete"
                  mode="text"
                  compact
                  onPress={() => handleEliminar(img.deleteToken!, index)}
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