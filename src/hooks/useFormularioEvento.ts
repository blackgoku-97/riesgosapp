import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ReporteData } from '../services/reporteService';

export const useFormularioEvento = () => {
  const [cargo, setCargo] = useState('');
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);
  const [lugarEspecifico, setLugarEspecifico] = useState('');
  const [fechaHora, setFechaHora] = useState(new Date());
  const [mostrarFechaHora, setMostrarFechaHora] = useState(false);
  const [tipoAccidente, setTipoAccidente] = useState('');
  const [lesion, setLesion] = useState('');
  const [actividad, setActividad] = useState('');
  const [clasificacion, setClasificacion] = useState('');
  const [frecuencia, setFrecuencia] = useState<number | null>(null);
  const [severidad, setSeveridad] = useState<number | null>(null);
  const [potencial, setPotencial] = useState('');
  const [medidasSeleccionadas, setMedidasSeleccionadas] = useState<string[]>([]);
  const [quienAfectado, setQuienAfectado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaReporte, setFechaReporte] = useState(new Date());
  const [mostrarFechaPicker, setMostrarFechaPicker] = useState(false);
  const [fechaConfirmada, setFechaConfirmada] = useState(false);
  const [fechaConfirmadaReporte, setFechaConfirmadaReporte] = useState(true);
  const [accionesSeleccionadas, setAccionesSeleccionadas] = useState<string[]>([]);
  const [condicionesSeleccionadas, setCondicionesSeleccionadas] = useState<string[]>([]);
  const [imagen, setImagen] = useState<string | null>(null);
  const [imagenLocal, setImagenLocal] = useState<string | null>(null);
  const [imagenCloudinaryURL, setImagenCloudinaryURL] = useState<string | null>(null);
  const [deleteToken, setDeleteToken] = useState<string | undefined>(undefined);
  const [expandirAcciones, setExpandirAcciones] = useState(false);
  const [expandirCondiciones, setExpandirCondiciones] = useState(false);
  const [expandirMedidas, setExpandirMedidas] = useState(false);
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');

  useEffect(() => {
    (async () => {
      const user = auth.currentUser;
      if (user) {
        const perfilRef = doc(db, 'perfiles', user.uid);
        const perfilSnap = await getDoc(perfilRef);
        if (perfilSnap.exists()) {
          const datos = perfilSnap.data();
          if (datos.cargo) setCargo(datos.cargo);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (frecuencia && severidad) {
      const producto = frecuencia * severidad;
      setPotencial(producto > 6 ? 'Alto Potencial' : 'Bajo Potencial');
    } else {
      setPotencial('');
    }
  }, [frecuencia, severidad]);

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
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
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
    const asignaciones: [Function, any][] = [
      [setCargo, datos.cargo],
      [setLugarEspecifico, datos.lugarEspecifico],
      [setActividad, datos.actividad],
      [setClasificacion, datos.clasificacion],
      [setDescripcion, datos.descripcion],
      [setImagen, datos.imagen],
      [setTipoAccidente, datos.tipoAccidente],
      [setLesion, datos.lesion],
      [setPotencial, datos.potencial],
      [setQuienAfectado, datos.quienAfectado],
      [setMedidasSeleccionadas, datos.medidasSeleccionadas],
      [setAccionesSeleccionadas, datos.accionesSeleccionadas],
      [setCondicionesSeleccionadas, datos.condicionesSeleccionadas],
      [setImagenLocal, datos.imagenLocal],
      [setImagenCloudinaryURL, datos.imagenCloudinaryURL],
      [setFrecuencia, datos.frecuencia],
      [setSeveridad, datos.severidad],
    ];
    asignaciones.forEach(([setter, valor]) => setter(valor ?? ''));
    if (datos.fechaHora) setFechaHora(new Date(datos.fechaHora));
    if (datos.fechaReporte) setFechaReporte(new Date(datos.fechaReporte));
    if (typeof datos.fechaConfirmada === 'boolean') setFechaConfirmada(datos.fechaConfirmada);
    if (typeof datos.fechaConfirmadaReporte === 'boolean') setFechaConfirmadaReporte(datos.fechaConfirmadaReporte);
  };

  const getPayloadNuevo = (
    extra: Pick<ReporteData, 'numeroReporte' | 'año' | 'fechaReporteLocal' | 'deleteToken'> & Partial<ReporteData>
  ): ReporteData => ({
    cargo,
    latitud,
    longitud,
    lugarEspecifico,
    fechaHora: fechaHora.toISOString(),
    fechaReporte: fechaReporte.toISOString(),
    actividad,
    clasificacion,
    descripcion,
    imagen: imagenCloudinaryURL || '',
    tipoAccidente,
    lesion,
    frecuencia: frecuencia ?? 0,
    severidad: severidad ?? 0,
    potencial: potencial || '',
    quienAfectado,
    medidasSeleccionadas,
    accionesSeleccionadas,
    condicionesSeleccionadas,
    fechaCreacion: new Date().toISOString(),
    ...extra,
  });

  const getPayloadUpdate = () => ({
    cargo,
    latitud,
    longitud,
    lugarEspecifico,
    fechaHora: fechaHora.toISOString(),
    fechaReporte: fechaReporte.toISOString(),
    actividad,
    clasificacion,
    descripcion,
    imagen,
    tipoAccidente,
    lesion,
    frecuencia: frecuencia ?? 0,
    severidad: severidad ?? 0,
    potencial: potencial || '',
    quienAfectado,
    medidasSeleccionadas,
    accionesSeleccionadas,
    condicionesSeleccionadas,
    fechaModificacion: new Date().toISOString(),
  });

  const toggleSeleccion = (item: string, lista: string[], setFunction: Function) => {
    lista.includes(item)
      ? setFunction(lista.filter((i) => i !== item))
      : setFunction([...lista, item]);
  };

  return {
    cargo, setCargo,
    latitud, setLatitud,
    longitud, setLongitud,
    lugarEspecifico, setLugarEspecifico,
    fechaHora, setFechaHora,
    mostrarFechaHora, setMostrarFechaHora,
    tipoAccidente, setTipoAccidente,
    clasificacion, setClasificacion,
    frecuencia, setFrecuencia,
    severidad, setSeveridad,
    potencial,
    medidasSeleccionadas, setMedidasSeleccionadas,
    lesion, setLesion,
    actividad, setActividad,
    descripcion, setDescripcion,
    quienAfectado, setQuienAfectado,
    fechaReporte, setFechaReporte,
    mostrarFechaPicker, setMostrarFechaPicker,
    fechaConfirmada, setFechaConfirmada,
    fechaConfirmadaReporte, setFechaConfirmadaReporte,
    accionesSeleccionadas, setAccionesSeleccionadas,
    condicionesSeleccionadas, setCondicionesSeleccionadas,
    imagen, setImagen,
    imagenLocal, setImagenLocal,
    imagenCloudinaryURL, setImagenCloudinaryURL,
    deleteToken, setDeleteToken,
    expandirAcciones, setExpandirAcciones,
    expandirCondiciones, setExpandirCondiciones,
    expandirMedidas, setExpandirMedidas,
    anioSeleccionado, setAnioSeleccionado,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
    toggleSeleccion,
    setearDatos,
    getPayloadNuevo,
    getPayloadUpdate,
    obtenerUbicacionActual,
  };
};