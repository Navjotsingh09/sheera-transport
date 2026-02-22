// Firebase Configuration
// Get these values from Firebase Console > Project Settings
// After creating your Firebase project, replace these with your actual credentials

const firebaseConfig = {
  apiKey: "AIzaSyDmL8K9pQrL2xZ9mN0oA1bC2dE3fG4hI5j",
  authDomain: "seehra-transport-demo.firebaseapp.com",
  projectId: "seehra-transport-demo",
  storageBucket: "seehra-transport-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
