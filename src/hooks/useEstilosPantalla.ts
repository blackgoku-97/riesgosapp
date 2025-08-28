import { useTheme } from 'react-native-paper';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface EstilosPantalla {
  comunes: {
    container: ViewStyle;
    logo: ImageStyle;
    button: ViewStyle;
    label: TextStyle;
    snackbarError: ViewStyle;
    scrollContent: ViewStyle;
    footerSpacer: ViewStyle;
    input: TextStyle;
    link: TextStyle;
  };
  acciones: {
    title: TextStyle;
    subtitle: TextStyle;
  };
  formPicker: {
    label: TextStyle;
    picker: ViewStyle;
  };
  botones: {
    excel: {
      container: ViewStyle;
      label: TextStyle;
    };
    pdf: {
      container: ViewStyle;
      label: TextStyle;
    };
    editar: {
      container: ViewStyle;
      label: TextStyle;
    };
    eliminar: {
      container: ViewStyle;
      label: TextStyle;
    };
  };
}

export const useEstilosPantalla = (): EstilosPantalla => {
  const theme = useTheme();

  const tokens = {
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 20,
      xl: 32,
    },
    radius: {
      sm: 4,
      md: 6,
      lg: 10,
    },
    fontSize: {
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 28,
    },
  };

  const colores = {
    fondoInput: theme.dark ? '#2A2A2A' : '#F0F0F0',
    textoPrimario: theme.colors.onBackground,
    bordeInput: theme.colors.outlineVariant || '#CCC',
  };

  const spacing = 20;
  const borderRadius = 6;

  return {
    comunes: {
      container: {
        flex: 1,
        padding: spacing,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      },
      logo: {
        width: 220,
        height: 120,
        resizeMode: 'contain',
        marginBottom: spacing,
      },
      button: {
        marginTop: spacing,
        borderRadius,
        paddingHorizontal: 30,
        paddingVertical: 8,
        backgroundColor: theme.colors.primary,
      },
      label: {
        color: theme.colors.onPrimary,
        fontSize: 16,
      },
      snackbarError: {
        backgroundColor: theme.colors.error,
      },
      scrollContent: {
        paddingBottom: 80,
      },
      footerSpacer: {
        height: 80,
      },
      input: {
        borderWidth: 1,
        borderColor: colores.bordeInput,
        borderRadius: 5,
        padding: 10,
        marginVertical: 8,
        width: '100%',
        backgroundColor: colores.fondoInput,
        color: colores.textoPrimario,
      },
      link: {
        color: '#D32F2F',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
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
    formPicker: {
      label: {
        fontSize: tokens.fontSize.lg,
        fontWeight: 'bold',
        marginTop: tokens.spacing.md,
        marginBottom: tokens.spacing.sm,
        color: colores.textoPrimario,
      },
      picker: {
        backgroundColor: colores.fondoInput,
        borderRadius: tokens.radius.md,
        marginBottom: tokens.spacing.md,
      },
    },
    botones: {
      excel: {
        container: {
          backgroundColor: '#08a339',
          minWidth: 140,
          flexGrow: 1,
        },
        label: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: 14,
        },
      },
      pdf: {
        container: {
          backgroundColor: '#a11a1a',
          minWidth: 140,
          flexGrow: 1,
        },
        label: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: 14,
        },
      },
      editar: {
        container: {
          backgroundColor: '#000',
          minWidth: 140,
          flexGrow: 1,
        },
        label: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: 14,
        },
      },
      eliminar: {
        container: {
          backgroundColor: '#D32F2F',
          minWidth: 140,
          flexGrow: 1,
        },
        label: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: 14,
        },
      },
    },
  };
};