import { SafeAreaView, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function BienvenidaScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-institucional-blanco dark:bg-neutral-900 px-6">
      <Image
        source={require('../../assets/logo.png')}
        className="w-48 h-16 mb-6"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-institucional-rojo mb-2">
        Bienvenido
      </Text>
      <Text className="text-base text-center text-institucional-negro dark:text-neutral-300 mb-6">
        Gestión de Riesgos y Reporte de Incidentes
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Login')}
        className="bg-institucional-rojo rounded-md w-full py-1"
        labelStyle={{ color: 'white', fontWeight: 'bold' }}
      >
        Comenzar
      </Button>
    </SafeAreaView>
  );
}