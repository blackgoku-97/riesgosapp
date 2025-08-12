import { TextInput, View, StyleSheet } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

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

  const styles = getStyles(theme);

  return (
    <View style={styles.campoContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.multiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        placeholderTextColor={theme.colors.outline}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const getStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    campoContainer: {
      marginVertical: 12,
    },
    label: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
      marginBottom: 6,
    },
    input: {
      borderBottomWidth: 1,
      borderColor: theme.colors.outlineVariant || '#CCC',
      padding: 10,
      color: theme.colors.onBackground,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    multiline: {
      textAlignVertical: 'top',
      paddingVertical: 12,
    },
    error: {
      color: theme.colors.error,
      fontSize: 14,
      marginTop: 4,
    },
  });