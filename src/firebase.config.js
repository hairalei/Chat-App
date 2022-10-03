import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAKrebHZQDdOdXBK72yKLcLgIcDMYMSJGI',
  authDomain: 'homechat-cfce9.firebaseapp.com',
  projectId: 'homechat-cfce9',
  storageBucket: 'homechat-cfce9.appspot.com',
  messagingSenderId: '689514865995',
  appId: '1:689514865995:web:f3a1346b5628303af674ce',
};

// Initialize Firebase
initializeApp(firebaseConfig);

//init firestore
const db = getFirestore();

//init firebase auth
const auth = getAuth();

//init firebase storage
const storage = getStorage();

export { db, auth, storage };
