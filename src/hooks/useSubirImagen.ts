import { Alert } from 'react-native';

interface ImagenSubida {
  url: string;
  publicId: string;
  deleteToken: string;
}

export const useSubirImagen = () => {
  const subirImagen = async (uri: string): Promise<ImagenSubida | null> => {
    const nombreArchivo = `incidente_${Date.now()}.jpg`;
    const data = new FormData();
    data.append('file', {
      uri,
      type: 'image/jpeg',
      name: nombreArchivo,
    } as any);

    // Preset unsigned con "Return delete token" activado en Cloudinary
    data.append('upload_preset', 'incidentes');

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dw8ixfrxq/image/upload',
        {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        }
      );

      const json = await res.json();

      if (json.secure_url && json.public_id && json.delete_token) {
        return {
          url: json.secure_url,
          publicId: json.public_id,
          deleteToken: json.delete_token,
        };
      }

      console.error('Error de Cloudinary:', json);
      Alert.alert(
        'Error',
        json?.error?.message || 'No se pudo subir la imagen'
      );
      return null;
    } catch (error) {
      console.error('Error de red:', error);
      Alert.alert('Error', 'No se pudo subir la imagen (fallo de red)');
      return null;
    }
  };

  return { subirImagen };
};