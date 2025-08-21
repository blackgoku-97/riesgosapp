import { collection, getDocs, deleteDoc, doc as docRef } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export type ImagenDocumento = {
  url: string;
  area: string;
  actividad: string[];
  fecha: string;
  deleteToken?: string;
  docId?: string;
  tipo: 'planificacion' | 'reporte';
};

export const obtenerImagenesDesde = async (
  coleccion: 'planificaciones' | 'reportes'
): Promise<ImagenDocumento[]> => {
  const snapshot = await getDocs(collection(db, coleccion));
  const imagenes: ImagenDocumento[] = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.imagen) {
      imagenes.push({
        url: data.imagen,
        area: data.area ?? 'Sin área',
        actividad: data.actividad ?? [],
        fecha: data.fecha ?? 'Sin fecha',
        deleteToken: data.deleteToken,
        docId: doc.id,
        tipo: coleccion === 'planificaciones' ? 'planificacion' : 'reporte',
      });
    }
  });

  return imagenes;
};

export const obtenerTodasLasImagenes = async (): Promise<ImagenDocumento[]> => {
  const [planificaciones, reportes] = await Promise.all([
    obtenerImagenesDesde('planificaciones'),
    obtenerImagenesDesde('reportes'),
  ]);
  return [...planificaciones, ...reportes];
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

export const eliminarImagenYDocumento = async (
  token: string,
  docId: string,
  coleccion: 'planificaciones' | 'reportes'
): Promise<boolean> => {
  const ok = await eliminarImagenCloudinary(token);
  if (ok) {
    try {
      await deleteDoc(docRef(db, coleccion, docId));
      return true;
    } catch (error) {
      console.error('Error al eliminar documento:', error);
    }
  }
  return false;
};