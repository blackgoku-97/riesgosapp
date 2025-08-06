import { useState, useEffect } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const useReportes = () => {
    const [reportes, setReportes] = useState<DocumentData[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargarReportes = async () => {
        setCargando(true);
        try {
            const snapshot = await getDocs(collection(db, 'reportes'));
            const lista = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setReportes(lista.reverse());
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