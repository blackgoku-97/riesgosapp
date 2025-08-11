import { useTheme } from 'react-native-paper';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface EstilosPantalla {
  comunes: {
    container: ViewStyle;
    logo: ImageStyle;
    button: ViewStyle;
    label: TextStyle;
  };
  acciones: {
    title: TextStyle;
    subtitle: TextStyle;
  };
  reporte: {
    title: TextStyle;
    subtitle: TextStyle;
    button: ViewStyle;
    logoContainer: ViewStyle;
    imagenPreview: ImageStyle;
    captura: ViewStyle;
  };
}

export const useEstilosPantalla = (): EstilosPantalla => {
  const theme = useTheme();

  return {
    comunes: {
      container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      },
      logo: {
        width: 220,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 30,
      },
      button: {
        marginTop: 20,
        borderRadius: 6,
        paddingHorizontal: 30,
        paddingVertical: 8,
        backgroundColor: theme.colors.primary,
      },
      label: {
        color: theme.colors.onPrimary,
        fontSize: 16,
      },
    },
    acciones: {
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme.colors.primary,
      },
      subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
        color: theme.colors.onBackground,
      },
    },
    reporte: {
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: theme.colors.primary,
      },
      subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme.colors.onBackground,
      },
      button: {
        marginTop: 30,
        borderRadius: 6,
        alignSelf: 'center',
        paddingHorizontal: 30,
        paddingVertical: 8,
        backgroundColor: theme.colors.primary,
      },
      logoContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
      },
      imagenPreview: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
      },
      captura: {
        marginTop: 20,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 20,
        paddingVertical: 8,
      }
    },
  };
};