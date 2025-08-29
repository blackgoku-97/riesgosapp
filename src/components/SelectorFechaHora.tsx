import { useState } from 'react';
import { View } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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
    <View className="py-2">
      <Text className="text-lg font-bold mb-2 text-on-surface">
        Fecha y hora del incidente:
      </Text>

      <Button
        icon={icono}
        mode="outlined"
        onPress={() => setVisible(true)}
        className="mb-2"
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
        <Text className="text-center mb-2 text-primary font-semibold">
          {textoConfirmado ?? `${formatoFecha} - ${formatoHora}`}
        </Text>
      ) : (
        <Text className="text-center mb-2 text-on-surface-variant">
          Aún no se ha seleccionado fecha
        </Text>
      )}
    </View>
  );
};