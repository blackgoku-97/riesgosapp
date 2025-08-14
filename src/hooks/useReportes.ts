import { useState, useEffect } from 'react';
import { collection, getDocs, DocumentData, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const useReportes = () => {
    const [reportes, setReportes] = useState<DocumentData[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargarReportes = async () => {
        setCargando(true);
        try {
            const ref = collection(db, 'reportes');
            const q = query(ref, orderBy('fechaReporte', 'asc')); // 👈 ordena por fecha ascendente
            const snapshot = await getDocs(q);

            const lista = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setReportes(lista); // ya viene ordenado
        } catch (error) {
            console.error('Error al cargar reportes:', error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarReportes();
    }, []);

    return { reportes, cargando, cargarReportes };
};