import { Alert } from 'react-native';

export const useSubirImagen = () => {
  const subirImagen = async (uri: string): Promise<string | null> => {
    const nombreArchivo = `incidente_${Date.now()}.jpg`;
    const data = new FormData();
    data.append('file', {
      uri,
      type: 'image/jpeg',
      name: nombreArchivo,
    } as any);
    data.append('upload_preset', 'incidentes');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dw8ixfrxq/image/upload', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      const json = await res.json();
      if (json.secure_url) return json.secure_url;

      console.error('Error de Cloudinary:', json);
      Alert.alert('Error', json?.error?.message || 'No se pudo subir la imagen');
      return null;
    } catch (error) {
      console.error('Error de red:', error);
      Alert.alert('Error', 'No se pudo subir la imagen (fallo de red)');
      return null;
    }
  };

  return { subirImagen };
};