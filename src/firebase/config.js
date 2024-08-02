import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCK7qCqtoq7N37Mzyxzev495RMqLiitw8E",
  authDomain: "barcode-scan-auth.firebaseapp.com",
  projectId: "barcode-scan-auth",
  storageBucket: "barcode-scan-auth.appspot.com",
  messagingSenderId: "139807033499",
  appId: "1:139807033499:web:886c42f94edd739cf75e3e"
};

// Inicializar o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Se já estiver inicializado, use a instância existente
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
