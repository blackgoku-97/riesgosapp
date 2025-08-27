import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type PreferenciaTema = 'light' | 'dark' | 'auto';

interface TemaContextType {
  preferencia: PreferenciaTema;
  esquemaActual: 'light' | 'dark';
  cambiarPreferencia: (nuevo: PreferenciaTema) => void;
}

const TemaContext = createContext<TemaContextType | undefined>(undefined);

const CLAVE_PREFERENCIA = 'preferenciaTema';

export const TemaProvider = ({ children }: { children: React.ReactNode }) => {
  const esquemaSistema = useColorScheme() ?? 'light';
  const [preferencia, setPreferencia] = useState<PreferenciaTema>('auto');

  useEffect(() => {
    const cargarPreferencia = async () => {
      const valor = await SecureStore.getItemAsync(CLAVE_PREFERENCIA);
      if (valor === 'light' || valor === 'dark' || valor === 'auto') {
        setPreferencia(valor);
      }
    };
    cargarPreferencia();
  }, []);

  const cambiarPreferencia = async (nuevo: PreferenciaTema) => {
    setPreferencia(nuevo);
    await SecureStore.setItemAsync(CLAVE_PREFERENCIA, nuevo);
  };

  const esquemaActual = preferencia === 'auto' ? esquemaSistema : preferencia;

  return (
    <TemaContext.Provider value={{ preferencia, esquemaActual, cambiarPreferencia }}>
      {children}
    </TemaContext.Provider>
  );
};

export const useTemaUsuario = () => {
  const contexto = useContext(TemaContext);
  if (!contexto) throw new Error('useTemaUsuario debe usarse dentro de TemaProvider');
  return contexto;
};