import { estilosHTML } from './estilosHTML';

export const generarHTMLReporte = (
  reporte: any,
  logoBase64: string,
  imagenBase64?: string | null
) => {
  return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        ${estilosHTML()}
      </style>
    </head>
    <body>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <img src="${
          logoBase64 || 'https://placehold.org/120x50/cccccc/000000?text=LOGO'
        }" 
             alt="Logo institucional" style="height: 50px;" />
        <h1>${reporte.numeroReporte || `Reporte #${reporte.id?.slice(-5)}`}</h1>
      </div>
      <hr style="border-top: 2px solid #D32F2F;" />

      <h2>Datos del Reporte</h2>
      <table>
        <tr><td class="label">Cargo:</td><td>${reporte.cargo || ''}</td></tr>
        <tr>
          <td class="label">Ubicación:</td>
          <td>
            ${
              reporte.latitud && reporte.longitud
                ? `${reporte.latitud.toFixed(5)}, ${reporte.longitud.toFixed(5)}`
                : reporte.zona
                ? `${reporte.zona}${
                    reporte.subZona ? ` - ${reporte.subZona}` : ''
                  }`
                : 'Sin datos'
            }
          </td>
        </tr>
        <tr><td class="label">Lugar:</td><td>${reporte.lugarEspecifico || ''}</td></tr>
        <tr><td class="label">Fecha y hora:</td><td>${reporte.fechaReporteLocal || ''}</td></tr>
      </table>

      <h2>Detalles del Incidente</h2>
      <table>
        <tr><td class="label">¿A quién le ocurrió?</td><td>${reporte.quienAfectado || ''}</td></tr>
        <tr><td class="label">Tipo de accidente:</td><td>${reporte.tipoAccidente || ''}</td></tr>
        ${
          reporte.tipoAccidente !== 'Cuasi accidente' && reporte.lesion
            ? `<tr><td class="label">Lesión:</td><td>${reporte.lesion}</td></tr>`
            : ''
        }
        <tr><td class="label">Actividad:</td><td>${reporte.actividad || ''}</td></tr>
        <tr><td class="label">Clasificación:</td><td>${reporte.clasificacion || ''}</td></tr>
        ${
          reporte.condicionesSeleccionadas?.length
            ? `<tr><td class="label">Condiciones Inseguras:</td><td>${reporte.condicionesSeleccionadas.join(', ')}</td></tr>`
            : reporte.accionesSeleccionadas?.length
            ? `<tr><td class="label">Acciones Inseguras:</td><td>${reporte.accionesSeleccionadas.join(', ')}</td></tr>`
            : ''
        }

        ${
          reporte.cargo?.toLowerCase() === 'encargado de prevención de riesgos'
            ? `
              <tr><td class="label">Frecuencia:</td><td>${reporte.frecuencia || ''}</td></tr>
              <tr><td class="label">Severidad:</td><td>${reporte.severidad || ''}</td></tr>
              <tr><td class="label">Potencial:</td><td>${reporte.potencial || ''}</td></tr>
            `
            : ''
        }

        <tr><td class="label">Medidas de control:</td><td>${reporte.medidasSeleccionadas?.join(', ') || ''}</td></tr>
      </table>

      <h2>Descripción del Reporte</h2>
      <div class="descripcion">
        <p>${reporte.descripcion || ''}</p>
      </div>

      ${
        imagenBase64
          ? `
        <div class="imagen">
          <h2>Imagen del Incidente</h2>
          <img src="${imagenBase64}" alt="Imagen del incidente" />
        </div>
      `
          : ''
      }
    </body>
  </html>
  `;
};

export const generarHTMLPlanificacion = (
  planificacion: any,
  logoBase64: string,
  imagenBase64?: string | null
) => {
  const esEPR =
    planificacion.cargo?.trim().toLowerCase() ===
    'encargado de prevención de riesgos';

  return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        ${estilosHTML()}
      </style>
    </head>
    <body>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <img src="${
          logoBase64 ||
          'https://placehold.org/120x50/cccccc/000000?text=LOGO'
        }" 
             alt="Logo institucional" style="height: 50px;" />
        <h1>${planificacion.numeroPlanificacion || ''}</h1>
      </div>
      <hr style="border-top: 2px solid #D32F2F;" />

      <h2>Datos de la Planificación</h2>
      <table>
        <tr><td class="label">Fecha:</td><td>${planificacion.fecha || ''}</td></tr>
        <tr><td class="label">Cargo:</td><td>${planificacion.cargo || ''}</td></tr>
        <tr><td class="label">Plan de Trabajo:</td><td>${planificacion.planTrabajo || ''}</td></tr>
        <tr><td class="label">Área:</td><td>${planificacion.area || ''}</td></tr>
        <tr><td class="label">Proceso:</td><td>${Array.isArray(planificacion.proceso) ? planificacion.proceso.join(', ') : planificacion.proceso || ''}</td></tr>
        <tr><td class="label">Actividad:</td><td>${Array.isArray(planificacion.actividad) ? planificacion.actividad.join(', ') : planificacion.actividad || ''}</td></tr>
        <tr><td class="label">Peligros:</td><td>${
          Array.isArray(planificacion.peligro)
            ? planificacion.peligro.join(', ')
            : planificacion.peligro || ''
        }</td></tr>
        <tr><td class="label">Agente Material:</td><td>${Array.isArray(planificacion.agenteMaterial) ? planificacion.agenteMaterial.join(', ') : planificacion.agenteMaterial || ''}</td></tr>
        ${
          esEPR
            ? `
        <tr><td class="label">Frecuencia:</td><td>${planificacion.frecuencia ?? ''}</td></tr>
        <tr><td class="label">Severidad:</td><td>${planificacion.severidad ?? ''}</td></tr>
        `
            : ''
        }
        <tr><td class="label">Riesgo:</td><td>${planificacion.riesgo || ''}</td></tr>
        <tr><td class="label">Medidas de Control:</td><td>${planificacion.medidas?.join(', ') || ''}</td></tr>
        ${
          planificacion.latitud && planificacion.longitud
            ? `<tr><td class="label">Ubicación:</td><td>${planificacion.latitud}, ${planificacion.longitud}</td></tr>`
            : ''
        }
      </table>

      ${
        imagenBase64
          ? `
        <div class="imagen">
          <h2>Imagen de la Planificación</h2>
          <img src="${imagenBase64}" alt="Imagen de planificación" />
        </div>
      `
          : ''
      }
    </body>
  </html>
  `;
};