import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Area } from '../utils/opcionesPlanificaciones';
import { PlanificacionData } from '../services/planificacionService';

export const useFormularioPlanificacion = () => {
  const [cargo, setCargo] = useState('');
  const [planTrabajo, setPlanTrabajo] = useState('');
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);
  const [area, setArea] = useState<Area>('Seleccione un area');
  const [proceso, setProceso] = useState<string[]>([]);
  const [actividad, setActividad] = useState<string[]>([]);
  const [peligro, setPeligro] = useState<string[]>([]);
  const [agenteMaterial, setAgenteMaterial] = useState<string[]>([]);
  const [frecuencia, setFrecuencia] = useState<number | null>(null);
  const [severidad, setSeveridad] = useState<number | null>(null);
  const [riesgo, setRiesgo] = useState('');
  const [medidas, setMedidas] = useState<string[]>([]);
  const [imagen, setImagen] = useState<string | null>(null);
  const [imagenLocal, setImagenLocal] = useState<string | null>(null);
  const [imagenCloudinaryURL, setImagenCloudinaryURL] = useState<string | null>(null);
  const [deleteToken, setDeleteToken] = useState<string | undefined>(undefined);
  const [expandirProcesos, setExpandirProcesos] = useState(false);
  const [expandirActividades, setExpandirActividades] = useState(false);
  const [expandirPeligros, setExpandirPeligros] = useState(false);
  const [expandirAgenteMaterial, setExpandirAgenteMaterial] = useState(false);
  const [expandirMedidas, setExpandirMedidas] = useState(false);
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');

  // Captura inicial opcional (para mostrar mapa o prellenar)
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const loc = await Location.getCurrentPositionAsync({});
          setLatitud(loc.coords.latitude);
          setLongitud(loc.coords.longitude);
        } catch {
          setAlertaMensaje('No se pudo obtener la ubicación.');
          setAlertaVisible(true);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (frecuencia && severidad) {
      const producto = frecuencia * severidad;
      setRiesgo(producto > 6 ? 'Aceptable' : 'No Aceptable');
    } else {
      setRiesgo('');
    }
  }, [frecuencia, severidad]);

  /**
   * Obtiene coordenadas frescas en el momento de la llamada
   */
  const obtenerUbicacionActual = async () => {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setAlertaMensaje(
        canAskAgain
          ? 'Permiso de ubicación denegado. Puedes activarlo en Configuración.'
          : 'La app no tiene permiso de ubicación. Actívalo manualmente en Configuración.'
      );
      setAlertaVisible(true);
      throw new Error('Permiso de ubicación denegado');
    }

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return { latitud: loc.coords.latitude, longitud: loc.coords.longitude };
    } catch (error) {
      setAlertaMensaje('No se pudo obtener la ubicación. Verifica que el GPS esté activado.');
      setAlertaVisible(true);
      throw error;
    }
  };

  const setearDatos = (datos: any) => {
    if (typeof datos.latitud === 'number') setLatitud(datos.latitud);
    if (typeof datos.longitud === 'number') setLongitud(datos.longitud);

    setPlanTrabajo(datos.planTrabajo ?? '');
    setArea(datos.area ?? 'Seleccione un area');
    setProceso(datos.proceso ?? []);
    setActividad(datos.actividad ?? []);
    setPeligro(datos.peligro ?? []);
    setAgenteMaterial(datos.agenteMaterial ?? []);
    setRiesgo(datos.riesgo ?? '');
    setMedidas(datos.medidas ?? []);
    setImagen(datos.imagen ?? null);
    setImagenLocal(datos.imagenLocal ?? null);
    setImagenCloudinaryURL(datos.imagenCloudinaryURL ?? null);
    setDeleteToken(datos.deleteToken ?? undefined);
    setFrecuencia(datos.frecuencia ?? null);
    setSeveridad(datos.severidad ?? null);
  };

  // Para creación o duplicado
  const getPayloadNuevo = (
    extra: Pick<PlanificacionData, 'numeroPlanificacion' | 'año' | 'fechaPlanificacionLocal' | 'deleteToken'> & Partial<PlanificacionData>
  ): PlanificacionData => ({
    planTrabajo,
    latitud,
    longitud,
    area,
    proceso,
    actividad,
    peligro,
    agenteMaterial,
    frecuencia: frecuencia ?? 0,
    severidad: severidad ?? 0,
    riesgo: riesgo ?? '',
    medidas,
    imagen,
    imagenLocal,
    imagenCloudinaryURL,
    deleteToken,
    fechaCreacion: new Date().toISOString(),
    ...extra,
  });

  // Para edición destructiva
  const getPayloadUpdate = () => ({
    planTrabajo,
    latitud,
    longitud,
    area,
    proceso,
    actividad,
    peligro,
    agenteMaterial,
    frecuencia: frecuencia ?? 0,
    severidad: severidad ?? 0,
    riesgo: riesgo ?? '',
    medidas,
    imagen,
    imagenLocal,
    imagenCloudinaryURL,
    deleteToken,
    fechaModificacion: new Date().toISOString(),
  });

  return {
    cargo,
    planTrabajo, setPlanTrabajo,
    latitud, setLatitud,
    longitud, setLongitud,
    area, setArea,
    proceso, setProceso,
    actividad, setActividad,
    peligro, setPeligro,
    agenteMaterial, setAgenteMaterial,
    frecuencia, setFrecuencia,
    severidad, setSeveridad,
    riesgo, setRiesgo,
    medidas, setMedidas,
    imagen, setImagen,
    imagenLocal, setImagenLocal,
    imagenCloudinaryURL, setImagenCloudinaryURL,
    deleteToken, setDeleteToken,
    expandirProcesos, setExpandirProcesos,
    expandirActividades, setExpandirActividades,
    expandirPeligros, setExpandirPeligros,
    expandirAgenteMaterial, setExpandirAgenteMaterial,
    expandirMedidas, setExpandirMedidas,
    anioSeleccionado, setAnioSeleccionado,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
    setearDatos,
    getPayloadNuevo,
    getPayloadUpdate,
    obtenerUbicacionActual, // <- NUEVO
  };
};