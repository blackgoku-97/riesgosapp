import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Area } from '../utils/opcionesPlanificaciones';

export const useFormularioPlanificacion = () => {
  const [planTrabajo, setPlanTrabajo] = useState('');
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);
  const [area, setArea] = useState<Area>('Seleccione un area');
  const [proceso, setProceso] = useState<string[]>([]);
  const [actividad, setActividad] = useState<string[]>([]);
  const [peligro, setPeligro] = useState<string[]>([]);
  const [agenteMaterial, setAgenteMaterial] = useState<string[]>([]);
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
  };

  // Para creación o duplicado
  const getPayloadNuevo = (extra: Record<string, any> = {}) => ({
    planTrabajo,
    latitud,
    longitud,
    area,
    proceso,
    actividad,
    peligro,
    agenteMaterial,
    riesgo,
    medidas,
    imagen,
    imagenLocal,
    imagenCloudinaryURL,
    deleteToken,
    fechaCreacion: new Date().toISOString(),
    ...extra, // Ej: numeroPlanificacion, referenciaOriginal
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
    riesgo,
    medidas,
    imagen,
    imagenLocal,
    imagenCloudinaryURL,
    deleteToken,
    fechaModificacion: new Date().toISOString(),
  });

  return {
    planTrabajo, setPlanTrabajo,
    latitud, setLatitud,
    longitud, setLongitud,
    area, setArea,
    proceso, setProceso,
    actividad, setActividad,
    peligro, setPeligro,
    agenteMaterial, setAgenteMaterial,
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
  };
};