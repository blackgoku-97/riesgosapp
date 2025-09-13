import { useState } from 'react';
import { View, Image, Text, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export const FotoEvidenciaInput = ({ onImageTaken }: { onImageTaken: (uri: string) => void }) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPhotoUri(uri);
        onImageTaken(uri);
        await MediaLibrary.saveToLibraryAsync(uri);
      }
    }
  };

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      onImageTaken(uri);
    }
  };

  return (
    <View className="my-5 items-center">
      <Text className="text-base font-bold mb-2 text-institucional-negro dark:text-white">
        📸 Evidencia fotográfica
      </Text>

      {photoUri ? (
        <Image source={{ uri: photoUri }} className="w-48 h-48 rounded-md mb-3" resizeMode="cover" />
      ) : (
        <Text className="text-neutral-500 mb-3">No hay imagen seleccionada</Text>
      )}

      <View className="space-y-2 w-full px-4">
        <Button title="Tomar foto" onPress={handleTakePhoto} />
        <Button title="Subir desde galería" onPress={handlePickPhoto} />
      </View>
    </View>
  );
};