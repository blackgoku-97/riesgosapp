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
        body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          color: #000000;
          padding: 24px;
        }
        h1 {
          color: #D32F2F;
          font-size: 24px;
          margin: 0;
        }
        h2 {
          color: #D32F2F;
          margin-top: 32px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }
        td {
          padding: 6px;
          vertical-align: top;
        }
        td.label {
          font-weight: bold;
          width: 180px;
        }
        .descripcion {
          border: 1px solid #D32F2F;
          padding: 12px;
          margin-top: 20px;
          background-color: #FAFAFA;
        }
        .imagen {
          margin-top: 24px;
        }
        .imagen img {
          max-width: 100%;
          height: auto;
          border: 1px solid #D32F2F;
        }
      </style>
    </head>
    <body>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <img src="${logoBase64 || 'https://via.placeholder.com/120x50?text=LOGO'}" alt="Logo institucional" style="height: 50px;" />
        <h1>${reporte.numeroReporte}</h1>
      </div>
      <hr style="border-top: 2px solid #D32F2F;" />

      <h2>Datos del Reporte</h2>
      <table>
        <tr><td class="label">Cargo:</td><td>${reporte.cargo}</td></tr>
        <tr><td class="label">Zona:</td><td>${reporte.zona}</td></tr>
        ${reporte.subZona ? `<tr><td class="label">Subzona:</td><td>${reporte.subZona}</td></tr>` : ''}
        <tr><td class="label">Lugar:</td><td>${reporte.lugarEspecifico}</td></tr>
        <tr><td class="label">Fecha y hora:</td><td>${reporte.fechaReporteLocal}</td></tr>
      </table>

      <h2>Detalles del Incidente</h2>
      <table>
        <tr><td class="label">Tipo de accidente:</td><td>${reporte.tipoAccidente}</td></tr>
        ${reporte.tipoAccidente !== 'Cuasi accidente' && reporte.lesion
          ? `<tr><td class="label">Lesión:</td><td>${reporte.lesion}</td></tr>`
          : ''}
        <tr><td class="label">Actividad:</td><td>${reporte.actividad}</td></tr>
        <tr><td class="label">Clasificación:</td><td>${reporte.clasificacion}</td></tr>
        ${reporte.condicionesSeleccionadas?.length
          ? `<tr><td class="label">Condiciones Inseguras:</td><td>${reporte.condicionesSeleccionadas.join(', ')}</td></tr>`
          : reporte.accionesSeleccionadas?.length
            ? `<tr><td class="label">Acciones Inseguras:</td><td>${reporte.accionesSeleccionadas.join(', ')}</td></tr>`
            : ''}
        <tr><td class="label">Potencial:</td><td>${reporte.potencial}</td></tr>
        <tr><td class="label">Medidas de control:</td><td>${reporte.medidasSeleccionadas?.join(', ')}</td></tr>
        <tr><td class="label">¿A quién le ocurrió?</td><td>${reporte.quienAfectado}</td></tr>
      </table>

      <h2>Descripción del Reporte</h2>
      <div class="descripcion">
        <p>${reporte.descripcion}</p>
      </div>

      ${imagenBase64 ? `
        <div class="imagen">
          <h2>Imagen del Incidente</h2>
          <img src="${imagenBase64}" alt="Imagen del incidente" />
        </div>
      ` : ''}
    </body>
  </html>
  `;
};

export const generarHTMLPlanificacion = (
  planificacion: any,
  logoBase64: string,
  imagenBase64?: string | null
) => {
  return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          color: #000000;
          padding: 24px;
        }
        h1 {
          color: #D32F2F;
          font-size: 24px;
          margin: 0;
        }
        h2 {
          color: #D32F2F;
          margin-top: 32px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }
        td {
          padding: 6px;
          vertical-align: top;
        }
        td.label {
          font-weight: bold;
          width: 180px;
        }
        .descripcion {
          border: 1px solid #D32F2F;
          padding: 12px;
          margin-top: 20px;
          background-color: #FAFAFA;
        }
        .imagen {
          margin-top: 24px;
        }
        .imagen img {
          max-width: 100%;
          height: auto;
          border: 1px solid #D32F2F;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <img src="${logoBase64 || 'https://via.placeholder.com/120x50?text=LOGO'}" alt="Logo institucional" style="height: 50px;" />
        <h1>${planificacion.numeroPlanificacion}</h1>
      </div>
      <hr style="border-top: 2px solid #D32F2F;" />

      <h2>Datos de la Planificación</h2>
      <table>
        <tr><td class="label">Fecha:</td><td>${planificacion.fecha}</td></tr>
        <tr><td class="label">Plan de Trabajo:</td><td>${planificacion.planTrabajo}</td></tr>
        <tr><td class="label">Área:</td><td>${planificacion.area}</td></tr>
        <tr><td class="label">Proceso:</td><td>${planificacion.proceso}</td></tr>
        <tr><td class="label">Actividad:</td><td>${planificacion.actividad}</td></tr>
        <tr><td class="label">Peligros:</td><td>${Array.isArray(planificacion.peligro) ? planificacion.peligro.join(', ') : planificacion.peligro}</td></tr>
        <tr><td class="label">Agente Material:</td><td>${planificacion.agenteMaterial}</td></tr>
        <tr><td class="label">Medidas de Control:</td><td>${planificacion.medidas?.join(', ')}</td></tr>
        <tr><td class="label">Riesgos:</td><td>${planificacion.riesgo}</td></tr>
      </table>

      ${imagenBase64 ? `
        <div class="imagen">
          <h2>Imagen de la Planificación</h2>
          <img src="${imagenBase64}" alt="Imagen de planificación" />
        </div>
      ` : ''}
    </body>
  </html>
  `;
};