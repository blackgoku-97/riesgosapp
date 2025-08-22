import * as FileSystem from 'expo-file-system';
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
      'Tipo de accidente': reporte.tipoAccidente || '—',
      ...(tipoAccidente !== 'cuasi accidente' && {
        'Lesión': reporte.lesion ?? '—',
      }),
      'Actividad': reporte.actividad || '—',
      'Clasificación': reporte.clasificacion || '—',
      ...(reporte.clasificacion === 'Acción Insegura' && {
        'Acciones Inseguras': reporte.accionesSeleccionadas?.join(', ') || '—',
      }),
      ...(reporte.clasificacion === 'Condición Insegura' && {
        'Condiciones Inseguras': reporte.condicionesSeleccionadas?.join(', ') || '—',
      }),
      'Potencial': reporte.potencial || '—',
      'Medidas de control': reporte.medidasSeleccionadas?.join(', ') || '—',
      '¿A quién le ocurrió?': reporte.quienAfectado || '—',
      'Descripción': reporte.descripcion ?? '—',
      'Imagen (URL)': reporte.imagen || 'No disponible',
    };

    const headers = Object.keys(baseData);
    const values = Object.values(baseData);

    const csv = `${headers.join(',')}\n${values.map(v => `"${v}"`).join(',')}`;
    const fileUri = `${FileSystem.documentDirectory}/reporte-${reporte.id}.csv`;

    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri);
  } catch (error) {
    console.error('Error al exportar CSV:', error);
  }
};

export const exportarCSVPlanificacion = async (planificacion: any) => {
  try {
    const baseData: Record<string, any> = {
      'Número de Planificación': planificacion.numeroPlanificacion || '—',
      'Fecha': planificacion.fecha || '—',
      'Plan de Trabajo': planificacion.planTrabajo || '—',
      'Área': planificacion.area || '—',
      'Proceso': planificacion.proceso || '—',
      'Actividad': planificacion.actividad || '—',
      'Peligros': Array.isArray(planificacion.peligro)
        ? planificacion.peligro.join(', ')
        : planificacion.peligro || '—',
      'Agente Material': planificacion.agenteMaterial || '—',
      'Medidas': planificacion.medidas?.join(', ') || '—',
      'Riesgos': Array.isArray(planificacion.riesgo)
        ? planificacion.riesgo.join(', ')
        : planificacion.riesgo || '—',
      'Imagen (URL)': planificacion.imagen || 'No disponible',
    };

    const headers = Object.keys(baseData);
    const values = Object.values(baseData);

    const csv = `${headers.join(',')}\n${values.map(v => `"${v}"`).join(',')}`;
    const fileUri = `${FileSystem.documentDirectory}/planificacion-${planificacion.id}.csv`;

    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri);
  } catch (error) {
    console.error('Error al exportar CSV:', error);
  }
};