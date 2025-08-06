import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  uri: string | null;
  setUri: (value: string | null) => void;
};

export default function VistaImagen({ uri, setUri }: Props) {
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
    <View style={styles.container}>
      <Text style={styles.label}>Imagen asociada</Text>
      {uri && <Image source={{ uri }} style={styles.image} />}
      <Button mode="outlined" onPress={tomarNuevaFoto} style={styles.button}>
        Tomar nueva foto
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  image: {
    height: 180,
    borderRadius: 6,
    marginVertical: 8,
  },
  button: {
    marginTop: 8,
    borderColor: '#D32F2F',
  },
});