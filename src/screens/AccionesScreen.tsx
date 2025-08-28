import { useEffect, useState } from 'react';
import { SafeAreaView, Image, View, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AccionesScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [rol, setRol] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string>('');
  const [genero, setGenero] = useState<string>(''); // masculino / femenino

  useEffect(() => {
    const cargarPerfil = async () => {
      const user = auth.currentUser;
      if (user) {
        const perfilRef = doc(db, 'perfiles', user.uid);
        const perfilSnap = await getDoc(perfilRef);
        if (perfilSnap.exists()) {
          const datos = perfilSnap.data();
          setRol(datos.rol);
          setNombre(datos.nombre || user.email || '');
          setGenero(datos.genero || '');
        } else {
          setNombre(user.email || '');
        }
      }
    };
    cargarPerfil();
  }, []);

  const saludo =
    genero.toLowerCase() === 'femenino'
      ? 'Bienvenida'
      : genero.toLowerCase() === 'masculino'
      ? 'Bienvenido'
      : 'Bienvenido/a';

  return (
    <SafeAreaView className="flex-1 bg-institucional-blanco dark:bg-neutral-900 px-6">
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        <Image
          source={require('../../assets/logo.png')}
          className="w-48 h-16 mt-4 mb-2"
          resizeMode="contain"
        />

        <Text className="text-base text-center text-institucional-negro dark:text-white mb-2">
          {saludo}{nombre ? `, ${nombre}` : ''} 👋
        </Text>

        <Text className="text-xl font-bold text-institucional-rojo text-center mb-1">
          Centro de Operaciones Preventivas
        </Text>
        <Text className="text-base text-center text-neutral-700 dark:text-neutral-300 mb-6">
          Seleccione una acción a realizar
        </Text>

        <View className="w-full space-y-5">
          <Button
            icon="calendar-check"
            mode="contained"
            onPress={() => navigation.navigate('Planificacion')}
            className="bg-institucional-rojo rounded-md"
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
          >
            Crear Planificación
          </Button>

          <Button
            icon="file-document"
            mode="contained"
            onPress={() => navigation.navigate('Reporte')}
            className="bg-institucional-negro rounded-md"
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
          >
            Crear Reporte
          </Button>

          <Button
            icon="file-search"
            mode="outlined"
            onPress={() => navigation.navigate('Historial Reportes')}
            className="border border-institucional-rojo rounded-md"
            labelStyle={{ color: '#D32F2F', fontWeight: 'bold' }}
          >
            Ver Reportes
          </Button>

          <Button
            icon="calendar-multiple"
            mode="outlined"
            onPress={() => navigation.navigate('Historial Planificaciones')}
            className="border border-institucional-rojo rounded-md"
            labelStyle={{ color: '#D32F2F', fontWeight: 'bold' }}
          >
            Ver Planificaciones
          </Button>

          {rol === 'admin' && (
            <Button
              icon="account-group"
              mode="contained"
              onPress={() => navigation.navigate('Ver Usuarios')}
              className="bg-blue-700 rounded-md"
              labelStyle={{ color: 'white', fontWeight: 'bold' }}
            >
              Ver Usuarios
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}