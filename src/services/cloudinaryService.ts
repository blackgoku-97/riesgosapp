import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export type ImagenPlanificacion = {
  url: string;
  area: string;
  actividad: string[];
  fecha: string;
  deleteToken?: string;
  docId?: string;
};

export const obtenerImagenesCloudinary = async (): Promise<ImagenPlanificacion[]> => {
  const snapshot = await getDocs(collection(db, 'planificaciones'));
  const imagenes: ImagenPlanificacion[] = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.imagen) {
      imagenes.push({
        url: data.imagen,
        area: data.area ?? 'Sin área',
        actividad: data.actividad ?? [],
        fecha: data.fecha ?? 'Sin fecha',
      });
    }
  });

  return imagenes;
};

export const eliminarImagenCloudinary = async (token: string): Promise<boolean> => {
  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dw8ixfrxq/delete_by_token', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return json.result === 'ok';
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    return false;
  }
};