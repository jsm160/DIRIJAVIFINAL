// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB53pxu9jG1jaxw3ML-ukF_FjSvObBoRgI",
  authDomain: "diri-267ab.firebaseapp.com",
  databaseURL: "https://diri-267ab-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "diri-267ab",
  storageBucket: "diri-267ab.firebasestorage.app",
  messagingSenderId: "158202519628",
  appId: "1:158202519628:web:022fb060687914421a94e9",
  measurementId: "G-FLXGPGQXN2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app);