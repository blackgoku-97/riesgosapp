import { doc, getDocs, setDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

interface PlanificacionData {
  numeroPlanificacion: string;
  planTrabajo: string;
  area: string;
  proceso: string[];
  actividad: string[];
  peligro: string[];
  agenteMaterial: string[];
  riesgo: string;
  medidas: string[];
  imagen: string;
  deleteToken?: string;
}

export const guardarPlanificacion = async(data: PlanificacionData) => {
  const fechaCreacion = new Date().toISOString();
  const planificacion = {
    ...data,
    fecha: fechaCreacion.split('T')[0],
    fechaCreacion,
  };

  const id = data.numeroPlanificacion; // Ej: "Planificación 001"
  await setDoc(doc(db, 'planificaciones', id), planificacion);
}

export async function obtenerNumeroPlanificacion() {
  const snapshot = await getDocs(collection(db, 'planificaciones'));

  const usados = snapshot.docs.map(doc => {
    const id = doc.id;
    const match = id.match(/^Planificación (\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  }).filter(n => n !== null);

  let numero = 1;
  while (usados.includes(numero)) {
    numero++;
  }

  const numeroFormateado = String(numero).padStart(3, '0');
  return `Planificación ${numeroFormateado}`;
}

export async function obtenerPlanificacionesOrdenadas() {
  const ref = collection(db, 'planificaciones');
  const q = query(ref, orderBy('fechaCreacion', 'asc')); // 👈 orden ascendente
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}