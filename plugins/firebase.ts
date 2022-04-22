import * as firebase from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DATABASE_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGE_SENDER_ID,
  appId: process.env.FB_APPID,
  measurementId: process.env.FB_MEASUREMENT_ID,
};

if (typeof window !== 'undefined' && !firebase.getApps().length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
export const getFirebaseAuth = (): Auth => getAuth();
export const getFirebaseDb = (): Firestore => getFirestore();