import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

export const exportarExcelReporte = async (reporte: any) => {
  try {
    // Paso 1: Estructura los datos como matriz de pares clave-valor

    const tipoAccidente = (reporte.tipoAccidente ?? '').trim().toLowerCase();

    const baseData: Record<string, any> = {
      'Número de Reporte': reporte.numeroReporte,
      'Cargo': reporte.cargo,
      'Zona': reporte.zona,
      'Subzona': reporte.subZona || '—',
      'Lugar': reporte.lugarEspecifico,
      'Fecha y hora': reporte.fechaReporteLocal,
      'Tipo de accidente': reporte.tipoAccidente,
    };

    // ✅ Insertar "Lesión" justo después de "Tipo de accidente"
    if (tipoAccidente !== 'cuasi accidente') {
      baseData['Lesión'] = reporte.lesion ?? '—';
    }

    // Continuar agregando el resto
    Object.assign(baseData, {
      'Actividad': reporte.actividad,
      'Clasificación': reporte.clasificacion,
      ...(reporte.clasificacion === 'Acción Insegura' && {
        'Acciones Inseguras': reporte.accionesSeleccionadas?.join(', ') || '—',
      }),
      ...(reporte.clasificacion === 'Condición Insegura' && {
        'Condiciones Inseguras': reporte.condicionesSeleccionadas?.join(', ') || '—',
      }),
      'Potencial': reporte.potencial,
      'Medidas de control': reporte.medidasSeleccionadas?.join(', ') || '—',
      '¿A quién le ocurrió?': reporte.quienAfectado,
      'Descripción': reporte.descripcion ?? '—',
      'Imagen (URL)': reporte.imagen || 'No disponible',
    });

    const data = [baseData];

    // Paso 2: Crea una hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

    // Paso 3: Genera el archivo binario
    const excelBuffer = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

    // Paso 4: Define ruta del archivo
    const fileUri = `${FileSystem.documentDirectory}/reporte-${reporte.id}.xlsx`;

    // Paso 5: Escribe y comparte
    await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri);
  } catch (error) {
    console.error('Error al exportar Excel:', error);
  }
};

export const exportarExcelPlanificacion = async (planificacion: any) => {
  try {
    // Paso 1: Estructura los datos como matriz de pares clave-valor
    const data = [{
      'Número de Planificación': planificacion.numeroPlanificacion,
      'Fecha': planificacion.fecha,
      'Plan de Trabajo': planificacion.planTrabajo,
      'Área': planificacion.area,
      'Proceso': planificacion.proceso,
      'Actividad': planificacion.actividad,
      'Peligros': planificacion.peligro?.join(', ') || '—',
      'Agente Material': planificacion.agenteMaterial,
      'Medidas': planificacion.medidas?.join(', ') || '—',
      'Riesgos': Array.isArray(planificacion.riesgo) ? planificacion.riesgo.join(', ') : planificacion.riesgo || '—',
    }];

    // Paso 2: Crea la hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Planificación');

    // Paso 3: Genera el archivo binario
    const excelBuffer = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

    // Paso 4: Define ruta del archivo
    const fileUri = `${FileSystem.documentDirectory}/planificacion-${planificacion.id}.xlsx`;

    // Paso 5: Escribe y comparte
    await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri);
  } catch (error) {
    console.error('Error al exportar Excel:', error);
  }
};