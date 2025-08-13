import { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { LOGO_PATH } from '../constants/assets';

export const useLogoBase64 = () => {
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cargarLogo = async () => {
      try {
        const asset = Asset.fromModule(LOGO_PATH);
        await asset.downloadAsync(); // necesario para obtener localUri

        const localUri = asset.localUri;
        if (!localUri) throw new Error('No se pudo obtener la URI local del logo');

        const destino = FileSystem.documentDirectory + 'logo.png';
        await FileSystem.copyAsync({ from: localUri, to: destino });

        const base64 = await FileSystem.readAsStringAsync(destino, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setLogoBase64(`data:image/png;base64,${base64}`);
      } catch (err) {
        console.error('Error al cargar logo institucional:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarLogo();
  }, []);

  return { logoBase64, isLoading, error };
};