import { useState } from 'react';
import { Area } from '../utils/opcionesPlanificaciones';

export const useFormularioPlanificacion = () => {

  const [planTrabajo, setPlanTrabajo] = useState('');
  const [area, setArea] = useState<Area>('Seleccione un area');
  const [proceso, setProceso] = useState('');
  const [actividad, setActividad] = useState('');
  const [peligro, setPeligro] = useState<string[]>([]);
  const [agenteMaterial, setAgenteMaterial] = useState('');
  const [riesgo, setRiesgo] = useState('');
  const [medidas, setMedidas] = useState<string[]>([]);
  const [imagen, setImagen] = useState<string | null>(null);
  const [imagenLocal, setImagenLocal] = useState<string | null>(null);
  const [imagenCloudinaryURL, setImagenCloudinaryURL] = useState<string | null>(null);
  const [expandirPeligros, setExpandirPeligros] = useState(false);
  const [expandirMedidas, setExpandirMedidas] = useState(false);
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');

  return {
    planTrabajo, setPlanTrabajo,
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
    expandirPeligros, setExpandirPeligros,
    expandirMedidas, setExpandirMedidas,
    anioSeleccionado, setAnioSeleccionado,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
  };
}