import { doc, getDocs, setDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

export interface PlanificacionData {
  numeroPlanificacion: string;
  año: number; // o "anio" sin tilde, más recomendable
  fechaPlanificacionLocal: string;
  planTrabajo: string;
  latitud: number | null;
  longitud: number | null;
  area: string;
  proceso: string[];
  actividad: string[];
  peligro: string[];
  agenteMaterial: string[];
  frecuencia: number;
  severidad: number;
  riesgo: string;
  medidas: string[];
  imagen: string | null;
  imagenLocal: string | null;
  imagenCloudinaryURL: string | null;
  deleteToken?: string;
  fechaCreacion: string;
  referenciaOriginal?: string;
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