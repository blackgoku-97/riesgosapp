interface CamposReporte {
  cargo: string;
  latitud: number | null;
  longitud: number | null;
  lugarEspecifico: string;
  fechaConfirmada: boolean;
  tipoAccidente: string;
  lesion: string;
  actividad: string;
  clasificacion: string;
  frecuencia: number | null;
  severidad: number | null;
  quienAfectado: string;
  descripcion: string;
  fechaConfirmadaReporte: boolean;
  imagen?: string | null;
  accionesSeleccionadas?: string[];
  condicionesSeleccionadas?: string[];
}

interface CamposPlanificacion {
  planTrabajo: string;
  latitud: number | null;
  longitud: number | null;
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
  latitud,
  longitud,
  lugarEspecifico,
  fechaConfirmada,
  tipoAccidente,
  lesion,
  actividad,
  clasificacion,
  frecuencia,
  severidad,
  quienAfectado,
  descripcion,
  fechaConfirmadaReporte,
  imagen,
  accionesSeleccionadas,
  condicionesSeleccionadas,
}: CamposReporte): string => {

  if (!cargo.trim()) return 'Debe seleccionar un cargo';
  if (latitud == null || longitud == null)
    return 'No se pudo obtener la ubicación del incidente';
  if (!lugarEspecifico.trim()) return 'Debe ingresar el lugar del incidente';
  if (!fechaConfirmada) return 'Debe confirmar la fecha del incidente';

  if (!tipoAccidente.trim()) return 'Debe seleccionar el tipo de accidente';
  if (tipoAccidente !== 'Cuasi Accidente' && !lesion.trim())
    return 'Debe seleccionar el tipo de lesión';
  if (!actividad.trim()) return 'Debe seleccionar la actividad';
  if (!clasificacion.trim()) return 'Debe seleccionar la clasificación';

  if (cargo?.toLowerCase() === 'encargado de prevención de riesgos') {
    if (!frecuencia) return 'Debes seleccionar la frecuencia';
    if (!severidad) return 'Debes seleccionar la severidad';
  }

  if (!quienAfectado.trim()) return 'Debe seleccionar a quién le ocurrió';
  if (!descripcion.trim()) return 'Debe escribir una descripción';

  if (!fechaConfirmadaReporte)
    return 'Debe confirmar la fecha del reporte';

  if (clasificacion === 'Acción Insegura' &&
    accionesSeleccionadas && accionesSeleccionadas.length === 0)
    return 'Seleccione al menos una acción insegura';

  if (clasificacion === 'Condición Insegura' &&
    condicionesSeleccionadas && condicionesSeleccionadas.length === 0)
    return 'Seleccione al menos una condición insegura';

  if (!imagen?.trim()) return 'Debe capturar una imagen del incidente';

  return '';
};

export const validarCamposPlanificacion = ({
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
  imagen
}: CamposPlanificacion): string => {
  if (!planTrabajo.trim()) return 'Debe rellenar el plan de trabajo';
  if (latitud == null || longitud == null)
    return 'No se pudo obtener la ubicación de la actividad';
  if (!area.trim()) return 'Debe seleccionar una area';
  if (!proceso.length) return 'Debe seleccionar un proceso';
  if (!actividad.length) return 'Debe seleccionar una actividad';
  if (!peligro.length) return 'Debe seleccionar al menos un peligro';
  if (!agenteMaterial.length) return 'Debe seleccionar un agente material';
  if (!riesgo.trim()) return 'Debe seleccionar un riesgo';
  if (!medidas.length) return 'Debe seleccionar al menos una medida';
  if (!imagen?.trim()) return 'Debe capturar una imagen de la actividad';
  return '';
};