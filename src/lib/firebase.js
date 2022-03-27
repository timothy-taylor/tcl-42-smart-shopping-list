// NOTE: import only the Firebase modules that you need in your app.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyBeFEkcFZx2TqClBWUDIKjZSghCDab1f8w",
  authDomain: "tcl-42-smart-shopping-list.firebaseapp.com",
  projectId: "tcl-42-smart-shopping-list",
  storageBucket: "tcl-42-smart-shopping-list.appspot.com",
  messagingSenderId: "469012788527",
  appId: "1:469012788527:web:ce86b7c28a9ed2f26b9dda"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
