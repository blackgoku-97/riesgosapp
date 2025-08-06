import { doc, getDocs, setDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export async function guardarPlanificacion(data: any) {
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

