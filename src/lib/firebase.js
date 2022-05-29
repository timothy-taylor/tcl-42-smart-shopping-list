import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7aUG50qF4Q0cMLrNB0siqwU3pnTD1-L8",
  authDomain: "shoppinglist-bccaa.firebaseapp.com",
  projectId: "shoppinglist-bccaa",
  storageBucket: "shoppinglist-bccaa.appspot.com",
  messagingSenderId: "133631334311",
  appId: "1:133631334311:web:51df67345e2e01ef228882"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
