// Firebase Config - Portfolio Sportif
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDV5ZfYBEtx4JGNzBRH1JzeUr_24kgix_8",
  authDomain: "portfolio-sportif.firebaseapp.com",
  projectId: "portfolio-sportif",
  storageBucket: "portfolio-sportif.firebasestorage.app",
  messagingSenderId: "988177468587",
  appId: "1:988177468587:web:244826a1f2b9555376bbee",
  measurementId: "G-CVYYSV9TQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, storage, analytics };
