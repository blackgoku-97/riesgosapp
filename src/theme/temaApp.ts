import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const temaClaro = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#FFFFFF',
    surface: '#F9F9F9',
    text: '#000000',
    primary: '#D32F2F',
    accent: '#D32F2F',
    onPrimary: '#FFFFFF',
    placeholder: '#555555',
  },
};

export const temaOscuro = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    primary: '#FF6F61',
    accent: '#FF6F61',
    onPrimary: '#000000',
    placeholder: '#CCCCCC',
  },
};