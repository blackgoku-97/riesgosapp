import { View, Text, Image } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';

type Props = {
  uri: string | null;
  setUri: (value: string | null) => void;
};

export const VistaImagen = ({ uri, setUri }: Props) => {
  const theme = useTheme();
  const estilos = useEstilosPantalla();

  const tomarNuevaFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) return;

    const resultado = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: false,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setUri(resultado.assets[0].uri);
    }
  };

  return (
    <View style={estilos.reporte.captura}>
      <Text style={estilos.reporte.subtitle}>Imagen asociada</Text>

      {uri && (
        <Image
          source={{ uri }}
          style={estilos.reporte.imagenPreview}
        />
      )}

      <Button
        mode="outlined"
        onPress={tomarNuevaFoto}
        style={{ borderColor: theme.colors.error }}
        textColor={theme.colors.error}
      >
        Tomar nueva foto
      </Button>
    </View>
  );
};