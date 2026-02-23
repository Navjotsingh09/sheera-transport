// Firebase Configuration
// Get these values from Firebase Console > Project Settings
// After creating your Firebase project, replace these with your actual credentials

const firebaseConfig = {
  apiKey: "AIzaSyDj-P1bUlBgEOUkNWBMLS7PuHPAue1TJ-M",
  authDomain: "seehra-transport.firebaseapp.com",
  projectId: "seehra-transport",
  storageBucket: "seehra-transport.firebasestorage.app",
  messagingSenderId: "969792126976",
  appId: "1:969792126976:web:6de53fdc40899ea03fd8e5",
  measurementId: "G-TKD088B9RV"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
