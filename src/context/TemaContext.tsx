import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PreferenciaTema = 'light' | 'dark' | 'auto';

interface TemaContextType {
  preferencia: PreferenciaTema;
  esquemaActual: 'light' | 'dark';
  cambiarPreferencia: (nuevo: PreferenciaTema) => void;
}

const TemaContext = createContext<TemaContextType | undefined>(undefined);

export const TemaProvider = ({ children }: { children: React.ReactNode }) => {
  const esquemaSistema = useColorScheme() ?? 'light';
  const [preferencia, setPreferencia] = useState<PreferenciaTema>('auto');

  useEffect(() => {
    AsyncStorage.getItem('preferenciaTema').then(valor => {
      if (valor === 'light' || valor === 'dark' || valor === 'auto') {
        setPreferencia(valor);
      }
    });
  }, []);

  const cambiarPreferencia = async (nuevo: PreferenciaTema) => {
    setPreferencia(nuevo);
    await AsyncStorage.setItem('preferenciaTema', nuevo);
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