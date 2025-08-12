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
  };
  acciones: {
    title: TextStyle;
    subtitle: TextStyle;
  };
  reporte: {
    title: TextStyle;
    subtitle: TextStyle;
    textArea: TextStyle;
    button: ViewStyle;
    logoContainer: ViewStyle;
    logo: ImageStyle;
    imagenPreview: ImageStyle;
    captura: ViewStyle;
  };
  planificacion: {
    title: TextStyle;
    label: TextStyle;
    textArea: TextStyle;
    button: ViewStyle;
    logoContainer: ViewStyle;
    logo: ImageStyle;
    imagenPreview: ImageStyle;
    espaciado: ViewStyle;
    captura: ViewStyle;
  };
  historialReportes: {
    container: ViewStyle;
    logoContainer: ViewStyle;
    logo: ImageStyle;
    title: TextStyle;
    scrollContent: ViewStyle;
    emptyText: TextStyle;
    card: ViewStyle;
    cardTitle: TextStyle;
    fecha: TextStyle;
    reporteHeader: ViewStyle;
    reporteDetalles: ViewStyle;
    actions: ViewStyle;
    actionButton: ViewStyle;
    imagenReporte?: ImageStyle;
  };
  historialPlanificaciones: {
    container: ViewStyle;
    logoContainer: ViewStyle;
    logo: ImageStyle;
    title: TextStyle;
    scrollContent: ViewStyle;
    emptyText: TextStyle;
    card: ViewStyle;
    cardTitle: TextStyle;
    imagen: ImageStyle;
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
        marginBottom: spacing,
        color: theme.colors.primary,
      },
      subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme.colors.onBackground,
      },
      textArea: {
        borderWidth: 1,
        borderColor: theme.colors.error,
        borderRadius,
        padding: 12,
        fontSize: 16,
        color: theme.colors.onBackground,
        backgroundColor: theme.dark ? '#2A2A2A' : '#FFF5F5',
        textAlignVertical: 'top',
      },
      button: {
        marginTop: spacing + 10,
        borderRadius,
        alignSelf: 'center',
        paddingHorizontal: 30,
        paddingVertical: 8,
        backgroundColor: theme.colors.primary,
      },
      logoContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
      },
      logo: {
        width: 80,
        height: 40,
        resizeMode: 'contain',
      },
      imagenPreview: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        alignSelf: 'center',
        marginVertical: 10,
      },
      captura: {
        marginTop: spacing,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        borderRadius,
        paddingHorizontal: 20,
        paddingVertical: 8,
      },
    },
    planificacion: {
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing,
        color: theme.colors.primary,
      },
      label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: theme.colors.onBackground,
      },
      textArea: {
        borderWidth: 1,
        borderColor: theme.colors.error,
        borderRadius,
        padding: 12,
        fontSize: 16,
        color: theme.colors.onBackground,
        backgroundColor: theme.dark ? '#2A2A2A' : '#FFF5F5',
        textAlignVertical: 'top',
      },
      button: {
        marginTop: spacing + 10,
        backgroundColor: theme.colors.primary,
        borderRadius,
        alignSelf: 'center',
        paddingHorizontal: 30,
        paddingVertical: 8,
      },
      logoContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
      },
      logo: {
        width: 80,
        height: 40,
        resizeMode: 'contain',
      },
      imagenPreview: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginVertical: 10,
      },
      espaciado: {
        marginVertical: 12,
      },
      captura: {
        marginTop: spacing,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        borderRadius,
        paddingHorizontal: 20,
        paddingVertical: 8,
      },
    },
    historialReportes: {
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: spacing,
        paddingTop: spacing,
      },
      logoContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
      },
      logo: {
        width: 80,
        height: 40,
        resizeMode: 'contain',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: spacing,
      },
      scrollContent: {
        paddingBottom: spacing * 2,
      },
      emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: spacing * 2,
        color: theme.colors.onBackground,
      },
      card: {
        marginBottom: spacing,
        backgroundColor: theme.dark ? '#2A2A2A' : '#F9F9F9',
        elevation: 3,
      },
      cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        color: theme.colors.onBackground,
      },
      fecha: {
        marginTop: 4,
        fontStyle: 'italic',
        color: theme.colors.onSurface,
      },
      reporteHeader: {
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outlineVariant || '#DDD',
        paddingBottom: 4,
      },
      reporteDetalles: {
        marginTop: 4,
        gap: 2,
      },
      actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'flex-start',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outlineVariant || '#EEE',
      },
      actionButton: {
        minWidth: 140,
        flexGrow: 1,
      },
      imagenReporte: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 6,
        resizeMode: 'cover',
      },
    },
    historialPlanificaciones: {
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: spacing,
        paddingTop: spacing,
      },
      logoContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
      },
      logo: {
        width: 80,
        height: 40,
        resizeMode: 'contain',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: spacing,
      },
      scrollContent: {
        paddingBottom: spacing * 2,
      },
      emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: spacing * 2,
        color: theme.colors.onBackground,
      },
      card: {
        marginBottom: spacing,
        backgroundColor: theme.dark ? '#2A2A2A' : '#F9F9F9',
        elevation: 3,
      },
      cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        color: theme.colors.onBackground,
      },
      imagen: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 6,
        resizeMode: 'cover',
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