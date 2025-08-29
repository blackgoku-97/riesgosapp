import { View } from 'react-native';
import { TextInput, Text, useTheme } from 'react-native-paper';

interface CampoTextoProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
}

export const CampoTexto = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline,
}: CampoTextoProps) => {
  const theme = useTheme();

  return (
    <View className="my-3">
      <Text className="text-lg font-bold mb-1 text-on-background">
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        placeholderTextColor={theme.colors.outline}
        className={`border-b px-3 py-2 text-on-background ${
          error ? 'border-error' : 'border-outline-variant'
        } ${multiline ? 'text-top py-3' : ''}`}
      />

      {error && (
        <Text className="text-error text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};