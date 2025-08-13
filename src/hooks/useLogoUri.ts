import { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { LOGO_PATH } from '../constants/assets';

export const useLogoUri = () => {
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const resolved = Image.resolveAssetSource(LOGO_PATH);
      if (!resolved?.uri) throw new Error('No se pudo resolver la URI del logo institucional');
      setLogoUri(resolved.uri);
    } catch (err) {
      console.error('Error al obtener URI del logo:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { logoUri, isLoading, error };
};