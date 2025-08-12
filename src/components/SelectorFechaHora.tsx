import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import type { MD3Theme } from 'react-native-paper';

interface SelectorFechaHoraProps {
  fechaHora: Date;
  setFechaHora: (date: Date) => void;
  fechaConfirmada: boolean;
  setFechaConfirmada: (value: boolean) => void;
  modo?: 'datetime' | 'date' | 'time';
  icono?: string;
  textoConfirmado?: string;
}

export const SelectorFechaHora = ({
  fechaHora,
  setFechaHora,
  fechaConfirmada,
  setFechaConfirmada,
  modo = 'datetime',
  icono = 'calendar',
  textoConfirmado,
}: SelectorFechaHoraProps) => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const formatoFecha = fechaHora.toLocaleDateString('es-CL');
  const formatoHora = fechaHora.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={estilos(theme).contenedor}>
      <Text style={estilos(theme).titulo}>Fecha y hora del incidente:</Text>

      <Button
        icon={icono}
        mode="outlined"
        onPress={() => setVisible(true)}
        style={estilos(theme).boton}
      >
        Seleccionar fecha y hora
      </Button>

      <DateTimePickerModal
        isVisible={visible}
        mode={modo}
        locale="es-ES"
        date={fechaHora}
        onConfirm={(date) => {
          setFechaHora(date);
          setFechaConfirmada(true);
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />

      {fechaConfirmada ? (
        <Text style={estilos(theme).textoConfirmado}>
          {textoConfirmado ?? `${formatoFecha} - ${formatoHora}`}
        </Text>
      ) : (
        <Text style={estilos(theme).textoPendiente}>
          Aún no se ha seleccionado fecha
        </Text>
      )}
    </View>
  );
};

const estilos = (theme: MD3Theme) =>
  StyleSheet.create({
    contenedor: {
      paddingVertical: 8,
    },
    titulo: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.colors.onSurface,
    },
    boton: {
      marginBottom: 10,
    },
    textoConfirmado: {
      textAlign: 'center',
      marginBottom: 10,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    textoPendiente: {
      textAlign: 'center',
      marginBottom: 10,
      color: theme.colors.onSurfaceVariant,
    },
  });