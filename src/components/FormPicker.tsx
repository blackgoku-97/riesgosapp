import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native-paper';
import { View } from 'react-native';

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
  return (
    <View className="mb-4">
      <Text className="text-base font-semibold text-institucional-negro dark:text-white mb-2">
        {label}
      </Text>

      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        className="bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white rounded-md px-2 py-1"
      >
        <Picker.Item label={`Seleccione ${label.toLowerCase()}`} value="" />
        {options.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>
    </View>
  );
};