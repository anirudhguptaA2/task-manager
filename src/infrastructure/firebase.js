// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCAi0Wzm0MwBhTlRWVMqVN6Vs2o4KHeQ_o",
  authDomain: "vue-task-manager-e6292.firebaseapp.com",
  projectId: "vue-task-manager-e6292",
  storageBucket: "vue-task-manager-e6292.firebasestorage.app",
  messagingSenderId: "1051170561573",
  appId: "1:1051170561573:web:48a69cef2148c518d7e9cc",
  measurementId: "G-LNRZ11BEKJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);