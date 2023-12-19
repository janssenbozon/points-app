// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMGkdTY1CvkY2J21ypuGLJXChmDkADcFk",
  authDomain: "points-app-c2759.firebaseapp.com",
  projectId: "points-app-c2759",
  storageBucket: "points-app-c2759.appspot.com",
  messagingSenderId: "222413035984",
  appId: "1:222413035984:web:a08de63b9b4f3ce12d41d5",
  measurementId: "G-S7HBWQXMFK",
  databaseURL: "https://points-app-c2759-default-rtdb.firebaseio.com/"
};

const dev = true;

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = app.name && typeof window !== 'undefined' ? getAnalytics(app) : null;
export const firestore = getFirestore();
export const authentication = getAuth();
export const database = getDatabase(app);

if (dev) {
  connectAuthEmulator(authentication, 'http://localhost:9099');
  connectDatabaseEmulator(database, 'localhost', 9000);
}

