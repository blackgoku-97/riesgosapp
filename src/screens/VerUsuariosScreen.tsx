import { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator, View } from 'react-native';
import { Text, List, Divider, Badge } from 'react-native-paper';
import {
  collection,
  query,
  orderBy,
  doc,
  getDoc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';

interface Perfil {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  creadoEn?: Timestamp;
}

export default function VerUsuariosScreen() {
  const estilos = useEstilosPantalla();
  const [usuarios, setUsuarios] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);
  const [fechaAdmin, setFechaAdmin] = useState<Timestamp | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const perfilRef = doc(db, 'perfiles', user.uid);
      const perfilSnap = await getDoc(perfilRef);

      if (!perfilSnap.exists() || perfilSnap.data().rol !== 'admin') {
        setLoading(false);
        return;
      }

      setEsAdmin(true);
      setFechaAdmin(perfilSnap.data().creadoEn);

      const q = query(collection(db, 'perfiles'), orderBy('creadoEn', 'asc'));
      unsubscribe = onSnapshot(q, snapshot => {
        const data: Perfil[] = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() } as Perfil))
          .filter(perfil => perfil.id !== user.uid);

        setUsuarios(data);
        setLoading(false);
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Estado: sin permisos
  if (!esAdmin && !loading) {
    return (
      <SafeAreaView style={[estilos.comunes.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={estilos.acciones.subtitle}>
          No tienes permisos para ver esta sección
        </Text>
      </SafeAreaView>
    );
  }

  // Estado: cargando
  if (loading) {
    return (
      <SafeAreaView style={[estilos.comunes.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#D32F2F" />
        <Text>Cargando usuarios...</Text>
      </SafeAreaView>
    );
  }

  // Estado: sin usuarios
  if (usuarios.length === 0) {
    return (
      <SafeAreaView style={[estilos.comunes.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={estilos.acciones.subtitle}>
          No hay otros usuarios registrados
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[estilos.comunes.container, { flex: 1 }]}>
      <Text style={estilos.acciones.title}>Usuarios Registrados</Text>

      <FlatList
        data={usuarios}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={Divider}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const esNuevo =
            fechaAdmin &&
            item.creadoEn &&
            item.creadoEn.toMillis() > fechaAdmin.toMillis();

          return (
            <List.Item
              title={() => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{`${item.nombre} (${item.rol.toUpperCase()})`}</Text>
                  {esNuevo && (
                    <Badge
                      style={{
                        marginLeft: 8,
                        backgroundColor: '#4CAF50',
                        color: 'white'
                      }}
                    >
                      Nuevo
                    </Badge>
                  )}
                </View>
              )}
              description={item.email}
              left={props => (
                <List.Icon
                  {...props}
                  icon={item.rol === 'admin' ? 'crown' : 'account'}
                />
              )}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}