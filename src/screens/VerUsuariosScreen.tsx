import { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator, View } from 'react-native';
import { Text, List, Divider, Badge } from 'react-native-paper';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';

interface Perfil {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  creadoEn?: any; // Timestamp de Firestore
}

export default function VerUsuariosScreen() {
  const estilos = useEstilosPantalla();
  const [usuarios, setUsuarios] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);
  const [fechaAdmin, setFechaAdmin] = useState<any>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // 1️⃣ Obtener perfil del admin
      const perfilRef = doc(db, 'perfiles', user.uid);
      const perfilSnap = await getDoc(perfilRef);

      if (perfilSnap.exists() && perfilSnap.data().rol === 'admin') {
        setEsAdmin(true);
        setFechaAdmin(perfilSnap.data().creadoEn);

        // 2️⃣ Traer todos los usuarios, ordenados por fecha de creación
        const q = query(collection(db, 'perfiles'), orderBy('creadoEn', 'asc'));
        const snapshot = await getDocs(q);

        const data: Perfil[] = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Perfil))
          .filter(perfil => perfil.id !== user.uid); // Excluir admin

        setUsuarios(data);
      }
      setLoading(false);
    };

    cargarDatos();
  }, []);

  if (!esAdmin && !loading) {
    return (
      <SafeAreaView style={[estilos.comunes.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={estilos.acciones.subtitle}>No tienes permisos para ver esta sección</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[estilos.comunes.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#D32F2F" />
        <Text>Cargando usuarios...</Text>
      </SafeAreaView>
    );
  }

  if (usuarios.length === 0) {
    return (
      <SafeAreaView style={[estilos.comunes.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={estilos.acciones.subtitle}>No hay otros usuarios registrados</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.comunes.container}>
      <Text style={estilos.acciones.title}>Usuarios Registrados</Text>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const esNuevo = fechaAdmin && item.creadoEn?.toMillis() > fechaAdmin.toMillis();
          return (
            <>
              <List.Item
                title={() => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>{`${item.nombre} (${item.rol.toUpperCase()})`}</Text>
                    {esNuevo && (
                      <Badge style={{ marginLeft: 8, backgroundColor: '#4CAF50', color: 'white' }}>
                        Nuevo
                      </Badge>
                    )}
                  </View>
                )}
                description={item.email}
                left={props => <List.Icon {...props} icon={item.rol === 'admin' ? 'crown' : 'account'} />}
              />
              <Divider />
            </>
          );
        }}
      />
    </SafeAreaView>
  );
}