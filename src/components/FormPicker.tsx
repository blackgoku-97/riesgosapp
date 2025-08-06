import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function FormPicker ({
  label,
  selectedValue,
  onValueChange,
  options
}: {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: string[];
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
        <Picker.Item label={`Seleccione ${label.toLowerCase()}`} value="" />
        {options.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
});