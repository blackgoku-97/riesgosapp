import * as FileSystem from 'expo-file-system';

export const convertirImagenDesdeURL = async (url: string): Promise<string | null> => {
  try {
    // Detectar extensión para determinar el tipo MIME
    const extension = url.split('.').pop()?.toLowerCase();
    const mimeType =
      extension === 'png' ? 'image/png' :
      extension === 'webp' ? 'image/webp' :
      'image/jpeg'; // valor por defecto

    // Generar nombre único para evitar colisiones
    const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension || 'jpg'}`;
    const fileUri = `${FileSystem.cacheDirectory}${uniqueName}`;

    // Descargar imagen
    const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
    const downloadResult = await downloadResumable.downloadAsync();

    if (!downloadResult || !downloadResult.uri) {
      console.warn('La descarga de la imagen falló o no retornó URI.');
      return null;
    }

    // Leer imagen como base64
    const base64 = await FileSystem.readAsStringAsync(downloadResult.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Eliminar archivo temporal
    await FileSystem.deleteAsync(downloadResult.uri, { idempotent: true });

    // Retornar string base64 con tipo MIME correcto
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error al convertir imagen a base64:', error);
    return null;
  }
};