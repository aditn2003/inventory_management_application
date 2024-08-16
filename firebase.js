// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC96ZZWTU4tz6Zekkodvzh35e6tEBWmoSU",
    authDomain: "inventory-management-2af43.firebaseapp.com",
    projectId: "inventory-management-2af43",
    storageBucket: "inventory-management-2af43.appspot.com",
    messagingSenderId: "829847227376",
    appId: "1:829847227376:web:08c2ec765c0bee78a76b35",
    measurementId: "G-MWW5BKZ6XL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}