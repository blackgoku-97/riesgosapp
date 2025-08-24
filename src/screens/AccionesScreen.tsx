import { SafeAreaView, Image, View, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';
import { useEffect, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function AccionesScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const estilos = useEstilosPantalla();
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const cargarRol = async () => {
      const user = auth.currentUser;
      if (user) {
        const perfilRef = doc(db, 'perfiles', user.uid);
        const perfilSnap = await getDoc(perfilRef);
        if (perfilSnap.exists()) {
          setRol(perfilSnap.data().rol);
        }
      }
    };
    cargarRol();
  }, []);

  return (
    <SafeAreaView style={estilos.comunes.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        <Image source={require('../../assets/logo.png')} style={estilos.comunes.logo} />
        <Text style={estilos.acciones.title}>Centro de Operaciones Preventivas</Text>
        <Text style={estilos.acciones.subtitle}>Seleccione una acción a realizar</Text>

        <View style={{ width: '100%', gap: 20 }}>
          <Button
            icon="file-document"
            mode="contained"
            onPress={() => navigation.navigate('Reporte')}
            style={[estilos.comunes.button, { backgroundColor: '#D32F2F' }]}
            labelStyle={[estilos.comunes.label, { color: '#FFFFFF' }]}
          >
            Crear Reporte
          </Button>

          <Button
            icon="calendar-check"
            mode="contained"
            onPress={() => navigation.navigate('Planificacion')}
            style={[estilos.comunes.button, { backgroundColor: '#000000' }]}
            labelStyle={[estilos.comunes.label, { color: '#FFFFFF' }]}
          >
            Crear Planificación
          </Button>

          <Button
            icon="file-search"
            mode="outlined"
            onPress={() => navigation.navigate('Historial Reportes')}
            style={[estilos.comunes.button, {
              backgroundColor: 'transparent',
              borderColor: '#D32F2F',
              borderWidth: 1,
            }]}
            labelStyle={[estilos.comunes.label, { color: '#D32F2F' }]}
          >
            Ver Reportes
          </Button>

          <Button
            icon="calendar-multiple"
            mode="outlined"
            onPress={() => navigation.navigate('Historial Planificaciones')}
            style={[estilos.comunes.button, {
              backgroundColor: 'transparent',
              borderColor: '#D32F2F',
              borderWidth: 1,
            }]}
            labelStyle={[estilos.comunes.label, { color: '#D32F2F' }]}
          >
            Ver Planificaciones
          </Button>

          {/* 🔹 Botón visible solo si es admin */}
          {rol === 'admin' && (
            <Button
              icon="account-group"
              mode="contained"
              onPress={() => navigation.navigate('Ver Usuarios')}
              style={[estilos.comunes.button, { backgroundColor: '#1976D2' }]}
              labelStyle={[estilos.comunes.label, { color: '#FFFFFF' }]}
            >
              Ver Usuarios
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}