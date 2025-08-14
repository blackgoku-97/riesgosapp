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

/**
 * Guarda un reporte con fecha de creación ISO y fecha (YYYY-MM-DD).
 * Valida que el ID no exista antes de guardar.
 */
export const guardarReporte = async (data: any) => {
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