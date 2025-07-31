// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANh-0s3JEUg_egc54Gj52WebQL_4RKum0",
  authDomain: "boymo-pizza-app.firebaseapp.com",
  projectId: "boymo-pizza-app",
  storageBucket: "boymo-pizza-app.firebasestorage.app",
  messagingSenderId: "618873705695",
  appId: "1:618873705695:web:924a9d198690b96ad2c56a",
  measurementId: "G-LSSQPRWJ80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

