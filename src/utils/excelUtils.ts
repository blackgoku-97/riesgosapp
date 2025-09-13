import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const exportarCSVReporte = async (reporte: any) => {
  try {
    const tipoAccidente = (reporte.tipoAccidente ?? '').trim().toLowerCase();

    const ubicacion =
      reporte.latitud && reporte.longitud
        ? `${reporte.latitud.toFixed(5)}, ${reporte.longitud.toFixed(5)}`
        : reporte.zona
          ? `${reporte.zona}${reporte.subZona ? ` - ${reporte.subZona}` : ''}`
          : 'Sin datos';

    const baseData: Record<string, any> = {
      'Número de Reporte': reporte.numeroReporte || `Reporte #${reporte.id?.slice(-5)}`,
      'Cargo': reporte.cargo || '—',
      'Ubicación': ubicacion,
      'Lugar': reporte.lugarEspecifico || '—',
      'Fecha y hora': reporte.fechaReporteLocal || '—',
      '¿A quién le ocurrió?': reporte.quienAfectado || '—',
      'Tipo de accidente': reporte.tipoAccidente || '—',
      ...(tipoAccidente !== 'cuasi accidente' && { 'Lesión': reporte.lesion ?? '—' }),
      'Actividad': reporte.actividad || '—',
      'Clasificación': reporte.clasificacion || '—',
      ...(reporte.clasificacion === 'Acción Insegura' && {
        'Acciones Inseguras': reporte.accionesSeleccionadas?.join(', ') || '—',
      }),
      ...(reporte.clasificacion === 'Condición Insegura' && {
        'Condiciones Inseguras': reporte.condicionesSeleccionadas?.join(', ') || '—',
      }),
    };

    if (reporte.cargo?.toLowerCase() === 'encargado de prevención de riesgos') {
      baseData['Frecuencia'] = reporte.frecuencia || '—';
      baseData['Severidad'] = reporte.severidad || '—';
      baseData['Potencial'] = reporte.potencial || '—';
    }

    baseData['Medidas de control'] = reporte.medidasSeleccionadas?.join(', ') || '—';
    baseData['Descripción'] = reporte.descripcion ?? '—';
    baseData['Imagen (URL)'] = reporte.imagen || 'No disponible';

    const headers = Object.keys(baseData);
    const values = Object.values(baseData);
    const csv = `${headers.join(',')}\n${values.map(v => `"${v}"`).join(',')}`;

    // 📌 API nueva: File + ruta absoluta
    const filePath = `${Paths.document.uri}reporte-${reporte.id}.csv`;
    const file = new File(filePath);
    await file.write(csv);

    await Sharing.shareAsync(file.uri);
  } catch (error) {
    console.error('Error al exportar CSV:', error);
  }
};

export const exportarCSVPlanificacion = async (planificacion: any) => {
  try {
    const baseData: Record<string, any> = {
      'Número de Planificación': planificacion.numeroPlanificacion || '—',
      'Fecha': planificacion.fecha || '—',
      'Cargo': planificacion.cargo || '—',
      'Plan de Trabajo': planificacion.planTrabajo || '—',
      'Área': planificacion.area || '—',
      'Proceso': Array.isArray(planificacion.proceso)
        ? planificacion.proceso.join(', ')
        : planificacion.proceso || '—',
      'Actividad': Array.isArray(planificacion.actividad)
        ? planificacion.actividad.join(', ')
        : planificacion.actividad || '—',
      'Peligros': Array.isArray(planificacion.peligro)
        ? planificacion.peligro.join(', ')
        : planificacion.peligro || '—',
      'Agente Material': Array.isArray(planificacion.agenteMaterial)
        ? planificacion.agenteMaterial.join(', ')
        : planificacion.agenteMaterial || '—',
    };

    if (planificacion.cargo?.trim().toLowerCase() === 'encargado de prevención de riesgos') {
      baseData['Frecuencia'] = planificacion.frecuencia || '—';
      baseData['Severidad'] = planificacion.severidad || '—';
    }

    baseData['Medidas'] = Array.isArray(planificacion.medidas)
      ? planificacion.medidas.join(', ')
      : planificacion.medidas || '—';
    baseData['Riesgo'] = planificacion.riesgo || '—';
    baseData['Imagen (URL)'] = planificacion.imagen || 'No disponible';

    const headers = Object.keys(baseData);
    const values = Object.values(baseData);
    const csv = `${headers.join(',')}\n${values.map(v => `"${v}"`).join(',')}`;

    const filePath = `${Paths.document.uri}planificacion-${planificacion.id}.csv`;
    const file = new File(filePath);
    await file.write(csv);

    await Sharing.shareAsync(file.uri);
  } catch (error) {
    console.error('Error al exportar CSV:', error);
  }
};