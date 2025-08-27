import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB3vGi9fiDwEWOed6T_vEGwfdAzs2NGOsE",
  authDomain: "gestionriesgos-bb2c9.firebaseapp.com",
  projectId: "gestionriesgos-bb2c9",
  storageBucket: "gestionriesgos-bb2c9.firebasestorage.app",
  messagingSenderId: "1058505691736",
  appId: "1:1058505691736:web:49808e763787772cd5b02d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const db = getFirestore(app);
export const auth = getAuth(app);