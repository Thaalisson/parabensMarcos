// Importa os módulos necessários do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Suas configurações do Firebase (corrigido)
const firebaseConfig = {
  apiKey: "AIzaSyCOdKlRA6WmMqmwaCJz66zD4O2dnAKHEQQ",
  authDomain: "marcosfesta-57190.firebaseapp.com",
  projectId: "marcosfesta-57190",
  storageBucket: "marcosfesta-57190.appspot.com", // corrigido aqui
  messagingSenderId: "354571682166",
  appId: "1:354571682166:web:2b13733b94e2fa3db6fa57"
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore (banco de dados)
const db = getFirestore(app);

// Exporta para usar nos componentes
export { db };
