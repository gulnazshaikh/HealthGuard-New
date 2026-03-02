// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI8R0muaZ_Ax-OWLy55IozP3XO5FWSkAY",
  authDomain: "healthguard-aff38.firebaseapp.com",
  projectId: "healthguard-aff38",
  storageBucket: "healthguard-aff38.firebasestorage.app",
  messagingSenderId: "89662444336",
  appId: "1:89662444336:web:04753f2c52d37f32346ef5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 THIS LINE IS IMPORTANT
export const auth = getAuth(app);