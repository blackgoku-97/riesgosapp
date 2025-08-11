import { TextInput, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface CampoTextoProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
}

export const CampoTexto = ({ label, value, onChangeText, placeholder, error, multiline }: CampoTextoProps) => {
  return (
    <View style={estilos.campoContainer}>
      <Text style={estilos.label}>{label}</Text>
      <TextInput
        style={estilos.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
      {error && <Text style={estilos.error}>{error}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  campoContainer: {
    marginVertical: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    color: '#000',
  },
  error: {
    color: '#D32F2F',
    fontSize: 14,
    marginTop: 4,
  },
});