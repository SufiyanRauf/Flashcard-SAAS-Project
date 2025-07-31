// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX4FBSBdPzqraODFKWkrpSTZahJ2W6jms",
  authDomain: "flashcard-saas-eeea6.firebaseapp.com",
  projectId: "flashcard-saas-eeea6",
  storageBucket: "flashcard-saas-eeea6.firebasestorage.app",
  messagingSenderId: "751584381260",
  appId: "1:751584381260:web:1980671d5eb40b02db67e9",
  measurementId: "G-07WP7RDTWD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);