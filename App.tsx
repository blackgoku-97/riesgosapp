import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import { temaClaro, temaOscuro } from './src/theme/temaApp';
import { crearTemaNavegacion } from './src/theme/temaNavigation';
import { TemaProvider, useTemaUsuario } from './src/context/TemaContext';

function AppInterno() {
  const { esquemaActual } = useTemaUsuario(); // ← usa la preferencia del usuario
  const temaVisual = esquemaActual === 'dark' ? temaOscuro : temaClaro;
  const temaNavegacion = crearTemaNavegacion(esquemaActual, temaVisual);

  return (
    <PaperProvider theme={temaVisual}>
      <NavigationContainer theme={temaNavegacion}>
        <Navigation />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <TemaProvider>
      <AppInterno />
    </TemaProvider>
  );
}