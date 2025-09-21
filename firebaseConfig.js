
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBdLoG9XB-CQBrsaPIMHqwP7Orq4x9FDxI",
  authDomain: "shoestogo-53897.firebaseapp.com",
  projectId: "shoestogo-53897",
  storageBucket: "shoestogo-53897.firebasestorage.app",
  messagingSenderId: "770565799467",
  appId: "1:770565799467:web:f30ca388567564c204346e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)