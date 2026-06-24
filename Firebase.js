import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQAY_wXDlU5twKU9DLZCh3lgfBfLAy7AQ",
  authDomain: "kani-milk-agency-9323b.firebaseapp.com",
  projectId: "kani-milk-agency-9323b",
  storageBucket: "kani-milk-agency-9323b.firebasestorage.app",
  messagingSenderId: "317392951345",
  appId: "1:317392951345:web:1768ca6b7725812491dd10",
  measurementId: "G-K2VTQQ11MF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
