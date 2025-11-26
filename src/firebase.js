// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// ❌ Ya no hace falta:
// import { getStorage } from "firebase/storage";

// Tu configuración de Firebase:
const firebaseConfig = {
  apiKey: "AIzaSyDh3mX-A1HQGTXjmUbgaP2J_KrwL_fQ5Zs",
  authDomain: "armonia-ald.firebaseapp.com",
  projectId: "armonia-ald",
  // Podés dejar esto, no molesta aunque no uses Storage:
  storageBucket: "armonia-ald.firebasestorage.app",
  messagingSenderId: "568235191504",
  appId: "1:568235191504:web:3ec01c1f71a943303402d5",
};

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ❌ Fuera Storage:
// export const storage = getStorage(app);
