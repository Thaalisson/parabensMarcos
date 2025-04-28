// Importa os módulos necessários do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <--- IMPORTANTE para fotos

// Configurações do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCOdKlRA6WmMqmwaCJz66zD4O2dnAKHEQQ",
  authDomain: "marcosfesta-57190.firebaseapp.com",
  projectId: "marcosfesta-57190",
  storageBucket: "marcosfesta-57190.appspot.com", // para fotos
  messagingSenderId: "354571682166",
  appId: "1:354571682166:web:2b13733b94e2fa3db6fa57"
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore (banco de dados)
const db = getFirestore(app);

// Inicializa o Storage (armazenamento de fotos)
const storage = getStorage(app);

// Exporta para usar nos componentes
export { db, storage };
