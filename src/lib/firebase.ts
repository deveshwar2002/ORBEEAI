import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBI1WbJmqKJ_TkOhmvXGPOrpoI6DAeDu98",
  authDomain: "employee-task-tracker-d3dea.firebaseapp.com",
  projectId: "employee-task-tracker-d3dea",
  storageBucket: "employee-task-tracker-d3dea.firebasestorage.app",
  messagingSenderId: "759105425429",
  appId: "1:759105425429:web:1eeb2ecf20244713d33e1c",
  measurementId: "G-DRK5X263P2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);