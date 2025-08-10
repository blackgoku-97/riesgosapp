import { Theme as NavigationTheme } from '@react-navigation/native';
import { MD3Theme } from 'react-native-paper';

type FontStyle = {
  fontFamily: string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontSize: number;
};

export type TemaNavegacion = NavigationTheme & {
  fonts: {
    regular: FontStyle;
    medium: FontStyle;
    bold: FontStyle;
    heavy: FontStyle;
  };
};

export function crearTemaNavegacion(esquema: 'light' | 'dark', temaVisual: MD3Theme): TemaNavegacion {
  return {
    dark: esquema === 'dark',
    colors: {
      background: temaVisual.colors.background,
      card: temaVisual.colors.surface,
      text: temaVisual.colors.onSurface,
      border: temaVisual.colors.outline ?? '#ccc',
      notification: temaVisual.colors.primary,
      primary: temaVisual.colors.primary,
    },
    fonts: {
      regular: {
        ...temaVisual.fonts.bodyMedium,
        fontWeight: temaVisual.fonts.bodyMedium.fontWeight ?? '400',
      },
      medium: {
        ...temaVisual.fonts.titleMedium,
        fontWeight: temaVisual.fonts.titleMedium.fontWeight ?? '500',
      },
      bold: {
        ...temaVisual.fonts.titleLarge,
        fontWeight: temaVisual.fonts.titleLarge.fontWeight ?? '600',
      },
      heavy: {
        ...temaVisual.fonts.displayLarge,
        fontWeight: temaVisual.fonts.displayLarge.fontWeight ?? '700',
      },
    },
  };
}