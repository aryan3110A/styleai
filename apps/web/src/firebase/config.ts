// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBa0iFUkNzKRwNi-1AgExXIpgJBF0MB-NY",
  authDomain: "styleai-service.firebaseapp.com",
  projectId: "styleai-service",
  storageBucket: "styleai-service.firebasestorage.app",
  messagingSenderId: "637248126300",
  appId: "1:637248126300:web:ac5d8c7bdb9251d5545599",
  measurementId: "G-L7RKL2PBG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);