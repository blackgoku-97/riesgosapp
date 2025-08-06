import { useState, useEffect } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const usePlanificaciones = () => {
  const [planificaciones, setPlanificaciones] = useState<DocumentData[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarPlanificaciones = async () => {
    setCargando(true);
    try {
      const snapshot = await getDocs(collection(db, 'planificaciones'));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlanificaciones(lista.reverse());
    } catch (error) {
      console.error('Error al cargar planificaciones:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPlanificaciones();
  }, []);

  return { planificaciones, cargando, cargarPlanificaciones };
};