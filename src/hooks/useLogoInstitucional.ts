import { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { LOGO_PATH } from '../constants/assets';
import { convertirImagenDesdeURL } from '../utils';

const LOGO_FALLBACK_URL = 'https://placehold.org/120x50/cccccc/000000?text=LOGO';

export const useLogoInstitucional = () => {
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cargarLogo = async () => {
      try {
        // URI para mostrar en pantalla
        const resolved = Image.resolveAssetSource(LOGO_PATH);
        if (!resolved?.uri) throw new Error('No se pudo resolver la URI del logo institucional');
        setLogoUri(resolved.uri);

        // Base64 para exportar
        const asset = Asset.fromModule(LOGO_PATH);
        await asset.downloadAsync();

        const localUri = asset.localUri;
        if (!localUri) throw new Error('No se pudo obtener la URI local del logo');

        const destino = FileSystem.documentDirectory + 'logo.png';
        await FileSystem.copyAsync({ from: localUri, to: destino });

        const base64 = await FileSystem.readAsStringAsync(destino, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const logoFinal = `data:image/png;base64,${base64}`;
        if (!logoFinal.startsWith('data:image') || logoFinal.length < 100) {
          throw new Error('Logo institucional inválido o corrupto');
        }

        setLogoBase64(logoFinal);
      } catch (err) {
        console.warn('Logo institucional falló, usando fallback');
        try {
          const fallbackBase64 = await convertirImagenDesdeURL(LOGO_FALLBACK_URL);
          setLogoBase64(fallbackBase64);
          setLogoUri(LOGO_FALLBACK_URL);
        } catch (fallbackError) {
          console.error('Error al cargar el logo de respaldo:', fallbackError);
          setError(fallbackError as Error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    cargarLogo();
  }, []);

  return { logoUri, logoBase64, isLoading, error };
};