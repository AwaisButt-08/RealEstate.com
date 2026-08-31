// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-bf14b.firebaseapp.com",
  projectId: "mern-estate-bf14b",
  storageBucket: "mern-estate-bf14b.firebasestorage.app",
  messagingSenderId: "393192365176",
  appId: "1:393192365176:web:a3de7ce7cc4769888c618d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);