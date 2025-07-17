// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuhN2NJSkVfqV89tjsViGBj_4AN-8ll84",
  authDomain: "fruitea-d41da.firebaseapp.com",
  projectId: "fruitea-d41da",
  storageBucket: "fruitea-d41da.firebasestorage.app",
  messagingSenderId: "230477929968",
  appId: "1:230477929968:web:63cfb40c4557afeae81135",
  measurementId: "G-C9899PVZQ1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Authentification
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

export { auth, db };
