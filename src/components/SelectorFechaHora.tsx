import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface Props {
  fechaHora: Date;
  setFechaHora: (date: Date) => void;
  fechaConfirmada: boolean;
  setFechaConfirmada: (value: boolean) => void;
}

export const SelectorFechaHora = ({ fechaHora, setFechaHora, fechaConfirmada, setFechaConfirmada }: Props) => {
  const [visible, setVisible] = useState(false);

  const formatoFecha = fechaHora.toLocaleDateString('es-CL');
  const formatoHora = fechaHora.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Fecha y hora del incidente:</Text>
      <Button mode="outlined" onPress={() => setVisible(true)} style={{ marginBottom: 10 }}>
        Seleccionar fecha y hora
      </Button>

      <DateTimePickerModal
        isVisible={visible}
        mode="datetime"
        locale='es-ES'
        date={fechaHora}
        onConfirm={(date) => {
          setFechaHora(date);
          setFechaConfirmada(true); // ⬅️ activa confirmación
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />

      {fechaConfirmada && (
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>
          {formatoFecha} - {formatoHora}
        </Text>
      )}
    </View>
  );
}