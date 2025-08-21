interface CamposReporte {
  cargo: string;
  zona: string;
  subZona?: string;
  mostrarSubZona: boolean;
  lugarEspecifico: string;
  fechaConfirmada: boolean;
  tipoAccidente: string;
  lesion: string;
  actividad: string;
  clasificacion: string;
  potencial: string;
  quienAfectado: string;
  descripcion: string;
  fechaConfirmadaReporte: boolean;
  imagen?: string | null;
  accionesSeleccionadas?: string[];
  condicionesSeleccionadas?: string[];
}

interface CamposPlanificacion {
  planTrabajo: string;
  area: string;
  proceso: string[];
  actividad: string[];
  peligro: string[];
  agenteMaterial: string[];
  riesgo: string;
  medidas: string[];
  imagen?: string | null;
}

export const validarCamposReporte = ({
  cargo,
  zona,
  subZona,
  mostrarSubZona,
  lugarEspecifico,
  fechaConfirmada,
  tipoAccidente,
  lesion,
  actividad,
  clasificacion,
  potencial,
  quienAfectado,
  descripcion,
  fechaConfirmadaReporte,
  imagen,
  accionesSeleccionadas,
  condicionesSeleccionadas,
}: CamposReporte): string => {
  if (!cargo.trim()) return 'Debe seleccionar un cargo';
  if (!zona.trim()) return 'Debe seleccionar una zona';
  if (mostrarSubZona && !subZona?.trim()) return 'Debe seleccionar una subzona';
  if (!lugarEspecifico.trim()) return 'Debe ingresar el lugar del incidente';
  if (!fechaConfirmada) return 'Debe confirmar la fecha del incidente';

  if (!tipoAccidente.trim()) return 'Debe seleccionar el tipo de accidente';
  if (tipoAccidente !== 'Cuasi Accidente' && !lesion.trim()) return 'Debe seleccionar el tipo de lesión';
  if (!actividad.trim()) return 'Debe seleccionar la actividad';
  if (!clasificacion.trim()) return 'Debe seleccionar la clasificación';
  if (!potencial.trim()) return 'Debe seleccionar el potencial';
  if (!quienAfectado.trim()) return 'Debe seleccionar a quién le ocurrió';
  if (!descripcion.trim()) return 'Debe escribir una descripción';

  if (!fechaConfirmadaReporte) return 'Debe confirmar la fecha del reporte';

  if (clasificacion === 'Acción Insegura' && accionesSeleccionadas && accionesSeleccionadas.length === 0)
    return 'Seleccione al menos una acción insegura';

  if (clasificacion === 'Condición Insegura' && condicionesSeleccionadas && condicionesSeleccionadas.length === 0)
    return 'Seleccione al menos una condición insegura';

  if (!imagen?.trim()) return 'Debe capturar una imagen del incidente';

  return '';
};

export const validarCamposPlanificacion = ({
  planTrabajo,
  area,
  proceso,
  actividad,
  peligro,
  agenteMaterial,
  riesgo,
  medidas,
  imagen
}: CamposPlanificacion): string => {
  if (!planTrabajo.trim()) return 'Debe rellenar el plan de trabajo';
  if (!area.trim()) return 'Debe seleccionar una area';
  if (!proceso.length) return 'Debe seleccionar un proceso';
  if (!actividad.length) return 'Debe seleccionar una actividad';
  if (!peligro.length) return 'Debe seleccionar al menos un peligro';
  if (!agenteMaterial.length) return 'Debe seleccionar un agente material';
  if (!riesgo.trim()) return 'Debe seleccionar un riesgo';
  if (!medidas.length) return 'Debe seleccionar al menos una medida';
  if (!imagen?.trim()) return 'Debe capturar una imagen de la actividad';
  return '';
}