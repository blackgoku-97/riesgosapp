import { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

export const useLogoBase64 = () => {
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  useEffect(() => {
    const cargarLogo = async () => {
      const asset = Asset.fromModule(require('../../assets/logo.png'));
      await asset.downloadAsync();
      const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setLogoBase64(base64);
    };

    cargarLogo();
  }, []);

  return logoBase64;
};