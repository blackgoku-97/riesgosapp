import { useState } from 'react';
import { Area } from '../utils/opcionesPlanificaciones';

export default function useFormularioPlanificacion() {
  
  const [planTrabajo, setPlanTrabajo] = useState('');
  const [area, setArea] = useState<Area>('Seleccione un area');
  const [proceso, setProceso] = useState('');
  const [actividad, setActividad] = useState('');
  const [peligro, setPeligro] = useState<string[]>([]);
  const [agenteMaterial, setAgenteMaterial] = useState('');
  const [riesgo, setRiesgo] = useState('');
  const [medidas, setMedidas] = useState<string[]>([]);
  const [expandirPeligros, setExpandirPeligros] = useState(false);
  const [expandirMedidas, setExpandirMedidas] = useState(false);
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
    expandirPeligros, setExpandirPeligros,
    expandirMedidas, setExpandirMedidas,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
  };
}