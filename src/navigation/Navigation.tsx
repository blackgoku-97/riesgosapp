import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccionesScreen from '../screens/AccionesScreen';
import BienvenidaScreen from '../screens/BienvenidaScreen';
import EditarReporteScreen from '../screens/EditarReporteScreen';
import EditarPlanificacionScreen from '../screens/EditarPlanificacionScreen';
import HistorialReportesScreen from '../screens/HistorialReportesScreen';
import HistorialPlanificacionesScreen from '../screens/HistorialPlanificacionesScreen';
import LoginScreen from '../screens/LoginScreen';
import PlanificacionScreen from '../screens/PlanificacionScreen';
import ReporteScreen from '../screens/ReporteScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerUsuariosScreen from '../screens/VerUsuariosScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Bienvenida">
      <Stack.Screen name="Bienvenida" component={BienvenidaScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registro" component={RegisterScreen} />
      <Stack.Screen name="Ver Usuarios" component={VerUsuariosScreen} />
      <Stack.Screen name="Acciones" component={AccionesScreen} />
      <Stack.Screen name="Reporte" component={ReporteScreen} />
      <Stack.Screen name="Historial Reportes" component={HistorialReportesScreen} />
      <Stack.Screen name="Editar Reporte" component={EditarReporteScreen} />
      <Stack.Screen name="Editar Planificacion" component={EditarPlanificacionScreen} />
      <Stack.Screen name="Planificacion" component={PlanificacionScreen} />
      <Stack.Screen name="Historial Planificaciones" component={HistorialPlanificacionesScreen} />
    </Stack.Navigator>
  );
}