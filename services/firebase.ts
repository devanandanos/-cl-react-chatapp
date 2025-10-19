
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace this with your own Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiNK2jUq_P_jZUZEYf7rCSYeWHZqhESvM",
  authDomain: "multi-room-chat-app.firebaseapp.com",
  projectId: "multi-room-chat-app",
  storageBucket: "multi-room-chat-app.firebasestorage.app",
  messagingSenderId: "659980784619",
  appId: "1:659980784619:web:c775492a6caa67faee3fae",
  measurementId: "G-HFK34KJ44V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
