import {
  doc,
  getDocs,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export interface ReporteData {
  numeroReporte: string;               // Ej: "Reporte 001 - 2025"
  año: number;                         // Año del reporte
  cargo: string;                       // Cargo del afectado
  zona: string;                        // Zona general
  subZona?: string;                    // Subzona (si aplica)
  lugarEspecifico: string;             // Lugar del incidente
  fechaHora: string;                   // Fecha y hora del incidente (ISO)
  tipoAccidente: string;              // Tipo de accidente
  lesion?: string;                    // Tipo de lesión (si aplica)
  actividad: string;                  // Actividad que realizaba
  clasificacion: string;              // Clasificación del incidente
  potencial: string;                  // Potencial del incidente
  medidasSeleccionadas: string[];     // Medidas de control aplicadas
  quienAfectado: string;              // ¿A quién le ocurrió?
  descripcion: string;                // Descripción del incidente
  fechaReporte: string;               // Fecha de creación (ISO)
  fechaReporteLocal: string;          // Fecha formateada para Chile
  accionesSeleccionadas: string[];    // Acciones inseguras observadas
  condicionesSeleccionadas: string[]; // Condiciones inseguras observadas
  fechaCreacion: string;              // Timestamp de creación (ISO)
  imagen: string;                     // URL en Cloudinary
  deleteToken?: string;               // Token para eliminar imagen
}

/**
 * Guarda un reporte con fecha de creación ISO y fecha (YYYY-MM-DD).
 * Valida que el ID no exista antes de guardar.
 */
export const guardarReporte = async (data: ReporteData) => {
  const fechaCreacion = new Date().toISOString();
  const id = data.numeroReporte; // Ej: "Reporte 001"

  const ref = doc(db, 'reportes', id);
  const existente = await getDoc(ref);

  if (existente.exists()) {
    throw new Error(`⚠️ Ya existe un reporte con el ID ${id}`);
  }

  const reporte = {
    ...data,
    fecha: fechaCreacion.split('T')[0],
    fechaCreacion,
  };

  await setDoc(ref, reporte);
};

/**
 * Obtiene el próximo número disponible para un nuevo reporte.
 * Busca huecos y devuelve el menor libre, formateado con ceros a la izquierda.
 */
export const obtenerNumeroReporte = async (): Promise<number> => {
  const snapshot = await getDocs(collection(db, 'reportes'));

  const usados = snapshot.docs
    .map((doc) => {
      const match = doc.id.match(/^Reporte (\d+) - \d{4}$/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n): n is number => n !== null);

  let numero = 1;
  while (usados.includes(numero)) {
    numero++;
  }

  return numero;
};

/**
 * Lista todos los reportes ordenados por fecha de creación ascendente.
 */
export const obtenerReportesOrdenados = async () => {
  const ref = collection(db, 'reportes');
  const q = query(ref, orderBy('fechaCreacion', 'asc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};