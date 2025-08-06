import { useState } from 'react';
import { View, Image, Text, Button, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export default function FotoEvidenciaInput({ onImageTaken }: { onImageTaken: (uri: string) => void }) {
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const handleTakePhoto = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setPhotoUri(uri);
                onImageTaken(uri); // Envía la URI al componente padre
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
        <View style={styles.container}>
            <Text style={styles.label}>📸 Evidencia fotográfica</Text>

            {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.image} />
            ) : (
                <Text style={styles.placeholder}>No hay imagen seleccionada</Text>
            )}

            <Button title="Tomar foto" onPress={handleTakePhoto} />
            <Button title="Subir desde galería" onPress={handlePickPhoto} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginVertical: 20 },
    label: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
    image: { width: 200, height: 200, borderRadius: 8 },
    placeholder: { color: '#888', marginBottom: 10 },
});