import * as FileSystem from 'expo-file-system/legacy';

export const convertirImagenDesdeURL = async (url: string): Promise<string | null> => {
  try {
    const isLocal = url.startsWith('file://');

    // Detectar extensión y MIME
    const extension = url.split('.').pop()?.toLowerCase();
    const mimeType =
      extension === 'png' ? 'image/png' :
      extension === 'webp' ? 'image/webp' :
      'image/jpeg';

    let fileUri = url;

    // Si es remota, descargar primero
    if (!isLocal) {
      // Sanitizar nombre para evitar subcarpetas no existentes
      const safeName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension || 'jpg'}`
        .replace(/[\/\\:*?"<>|]/g, '_');

      fileUri = `${FileSystem.cacheDirectory}${safeName}`;

      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const downloadResult = await downloadResumable.downloadAsync();

      if (!downloadResult?.uri) {
        console.warn('La descarga de la imagen falló o no retornó URI.');
        return null;
      }

      fileUri = downloadResult.uri;
    }

    // Leer como base64
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: 'base64',
    });

    // Eliminar si fue temporal
    if (!isLocal) {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    }

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error al convertir imagen a base64:', error);
    return null;
  }
};