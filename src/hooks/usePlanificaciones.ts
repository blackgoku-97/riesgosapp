import { useState, useEffect } from 'react';
import { collection, getDocs, DocumentData, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const usePlanificaciones = () => {
  const [planificaciones, setPlanificaciones] = useState<DocumentData[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarPlanificaciones = async () => {
    setCargando(true);
    try {
      const ref = collection(db, 'planificaciones');
      const q = query(ref, orderBy('fechaCreacion', 'asc')); // 👈 orden ascendente
      const snapshot = await getDocs(q);

      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPlanificaciones(lista); // 👈 ya viene ordenado, no hace falta reverse
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