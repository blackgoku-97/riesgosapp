import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const useContadorReporte = () => {
  const obtenerNumeroSeguro = async (): Promise<number> => {
    const año = new Date().getFullYear().toString();
    const ref = doc(db, 'contadores', `reportes${año}`);

    const nuevoNumero = await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(ref);
      const actual = docSnap.exists() ? docSnap.data().ultimoNumero : 0;
      const siguiente = actual + 1;
      transaction.set(ref, { ultimoNumero: siguiente }, { merge: true });
      return siguiente;
    });

    return nuevoNumero;
  };

  return { obtenerNumeroSeguro };
};