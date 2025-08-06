import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const useNumeroReporte = () => {
  const obtenerNumeroReporte = async (): Promise<number> => {
    const añoActual = new Date().getFullYear().toString();
    const inicio = `${añoActual}-01-01T00:00:00.000Z`;
    const fin = `${añoActual}-12-31T23:59:59.999Z`;

    const ref = collection(db, 'reportes');
    const q = query(ref, where('fechaCreacion', '>=', inicio), where('fechaCreacion', '<=', fin));
    const snapshot = await getDocs(q);
    return snapshot.size + 1;
  };

  return { obtenerNumeroReporte };
};