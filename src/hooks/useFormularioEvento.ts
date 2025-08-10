import { useState } from 'react';

export default function useFormularioEvento() {

  const [cargo, setCargo] = useState('');
  const [zona, setZona] = useState('');
  const [subZona, setSubZona] = useState('');
  const [lugarEspecifico, setLugarEspecifico] = useState('');
  const [fechaHora, setFechaHora] = useState(new Date());
  const [mostrarFechaHora, setMostrarFechaHora] = useState(false);
  const [tipoAccidente, setTipoAccidente] = useState('');
  const [lesion, setLesion] = useState('');
  const [actividad, setActividad] = useState('');
  const [clasificacion, setClasificacion] = useState('');
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
  const [expandirAcciones, setExpandirAcciones] = useState(false);
  const [expandirCondiciones, setExpandirCondiciones] = useState(false);
  const [expandirMedidas, setExpandirMedidas] = useState(false);
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');

  const setearDatos = (datos: any) => {
    const asignaciones = [
      [setCargo, datos.cargo],
      [setZona, datos.zona],
      [setSubZona, datos.subZona],
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
    ];

    asignaciones.forEach(([setter, valor]) => setter(valor ?? ''));

    if (datos.fechaHora) setFechaHora(new Date(datos.fechaHora));
    if (datos.fechaReporte) setFechaReporte(new Date(datos.fechaReporte));
    if (typeof datos.fechaConfirmada === 'boolean') setFechaConfirmada(datos.fechaConfirmada);
    if (typeof datos.fechaConfirmadaReporte === 'boolean') setFechaConfirmadaReporte(datos.fechaConfirmadaReporte);
  };

  const getPayload = () => ({
    cargo,
    zona,
    subZona,
    lugarEspecifico,
    fechaHora: fechaHora.toISOString(),
    actividad,
    clasificacion,
    descripcion,
    imagen,
    tipoAccidente,
    lesion,
    potencial,
    quienAfectado,
    medidasSeleccionadas,
    accionesSeleccionadas,
    condicionesSeleccionadas,
    fechaModificacion: new Date().toISOString(),
  });

  const toggleSeleccion = (item: string, lista: string[], setFunction: Function) => {
    lista.includes(item)
      ? setFunction(lista.filter(i => i !== item))
      : setFunction([...lista, item]);
  };

  return {
    cargo, setCargo,
    zona, setZona,
    subZona, setSubZona,
    lugarEspecifico, setLugarEspecifico,
    fechaHora, setFechaHora,
    mostrarFechaHora, setMostrarFechaHora,
    tipoAccidente, setTipoAccidente,
    clasificacion, setClasificacion,
    potencial, setPotencial,
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
    expandirAcciones, setExpandirAcciones,
    expandirCondiciones, setExpandirCondiciones,
    expandirMedidas, setExpandirMedidas,
    anioSeleccionado, setAnioSeleccionado,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
    toggleSeleccion, setearDatos,
    getPayload
  };
}