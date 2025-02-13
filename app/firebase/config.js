// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARxhCpo99JclxhE0Sso5Pd3krmf3HMlTs",
  authDomain: "pantry-tracker-512cd.firebaseapp.com",
  projectId: "pantry-tracker-512cd",
  storageBucket: "pantry-tracker-512cd.appspot.com",
  messagingSenderId: "667878053293",
  appId: "1:667878053293:web:0af6f4507ca53431523d24",
  measurementId: "G-Y3Q5BE7JRK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

let analytics;
const initializeAnalytics = async () => {
  if (typeof window !== "undefined" && await isSupported()) {
    analytics = getAnalytics(app);
  }
};

initializeAnalytics(); // Call the function to initialize Analytics

export { app, firestore, storage, analytics, auth };
