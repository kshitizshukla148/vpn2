import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCCmF8p1jghj9NBtzOhPxYYJz_qKnyO-QE",
  authDomain: "vpndseducation.firebaseapp.com",
  projectId: "vpndseducation",
  storageBucket: "vpndseducation.firebasestorage.app",
  messagingSenderId: "264449257854",
  appId: "1:264449257854:web:617849511517837ddd832f",
  measurementId: "G-R4NWK1888H"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;