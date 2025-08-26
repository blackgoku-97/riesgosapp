import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native-paper';
import { useEstilosPantalla } from '../hooks';

export const FormPicker = ({
  label,
  selectedValue,
  onValueChange,
  options,
}: {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: string[];
}) => {
  const estilos = useEstilosPantalla();

  return (
    <>
      <Text style={estilos.formPicker.label}>{label}</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={estilos.formPicker.picker}
      >
        <Picker.Item label={`Seleccione ${label.toLowerCase()}`} value="" />
        {options.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>
    </>
  );
}