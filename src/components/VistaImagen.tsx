import { View, Text, Image } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  uri: string | null;
  setUri: (value: string | null) => void;
};

export const VistaImagen = ({ uri, setUri }: Props) => {
  const theme = useTheme();

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
    <View className="w-full items-center gap-y-4 mb-6">
      <Text className="text-base font-semibold text-institucional-negro dark:text-white">
        Imagen asociada
      </Text>

      {uri && (
        <Image
          source={{ uri }}
          className="w-full h-52 rounded-md"
          resizeMode="cover"
        />
      )}

      <Button
        mode="outlined"
        onPress={tomarNuevaFoto}
        className="border rounded-md"
        labelStyle={{ color: theme.colors.error, fontWeight: 'bold' }}
        style={{ borderColor: theme.colors.error }}
      >
        Tomar nueva foto
      </Button>
    </View>
  );
};