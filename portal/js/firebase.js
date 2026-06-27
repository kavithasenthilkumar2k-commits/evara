// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAhEy8kRGRlBHnzoVKvR9o2ojtkvGt1U3A",
  authDomain: "evara-interiors-portal.firebaseapp.com",
  projectId: "evara-interiors-portal",
  storageBucket: "evara-interiors-portal.firebasestorage.app",
  messagingSenderId: "347633528238",
  appId: "1:347633528238:web:04ea5792e3ecf654702c3f",
  measurementId: "G-05K3NNEGJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);