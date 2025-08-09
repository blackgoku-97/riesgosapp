import * as FileSystem from 'expo-file-system';

export const convertirImagenDesdeURL = async (url: string): Promise<string | null> => {
  try {
    const isLocal = url.startsWith('file://');

    // Detectar extensión para determinar el tipo MIME
    const extension = url.split('.').pop()?.toLowerCase();
    const mimeType =
      extension === 'png' ? 'image/png' :
      extension === 'webp' ? 'image/webp' :
      'image/jpeg'; // valor por defecto

    let fileUri = url;

    // Si es remota, descargar primero
    if (!isLocal) {
      const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension || 'jpg'}`;
      fileUri = `${FileSystem.cacheDirectory}${uniqueName}`;
      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const downloadResult = await downloadResumable.downloadAsync();

      if (!downloadResult || !downloadResult.uri) {
        console.warn('La descarga de la imagen falló o no retornó URI.');
        return null;
      }

      fileUri = downloadResult.uri;
    }

    // Leer imagen como base64
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Eliminar archivo temporal si fue descargado
    if (!isLocal) {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    }

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error al convertir imagen a base64:', error);
    return null;
  }
};