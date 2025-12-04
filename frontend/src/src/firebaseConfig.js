// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔹 Configuración de Firebase (usa solo una)
const firebaseConfig = {
  apiKey: "AIzaSyB_YkVDkrHeCJE7EcMQOnRWlPsXTQGNqBY",
  authDomain: "find-and-rate.firebaseapp.com",
  projectId: "find-and-rate",
  storageBucket: "find-and-rate.firebasestorage.app",
  messagingSenderId: "762881368529",
  appId: "1:762881368529:web:79ee5d79d87383cb6d80f0" // 👈 este es el válido
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
