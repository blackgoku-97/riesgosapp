import { doc, getDoc, getDocs, setDoc, deleteDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const guardarPlanificacion = async(data: any) => {
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

export const eliminarPlanificacionPorId = async (id: string) => {
  const ref = doc(db, 'planificaciones', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error(`❌ No existe ningúna planificación con el ID ${id}`);
  }

  const data = snap.data();

  if (data.imagenDeleteToken) {
    try {
      await fetch('https://api.cloudinary.com/v1_1/dw8ixfrxq/delete_by_token', {
        method: 'POST',
        body: new URLSearchParams({ token: data.imagenDeleteToken }),
      });
    } catch (error) {
      console.warn('⚠️ No se pudo borrar la imagen en Cloudinary:', error);
    }
  }

  await deleteDoc(ref);
};