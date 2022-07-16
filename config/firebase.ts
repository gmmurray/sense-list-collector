import * as firebase from 'firebase/app';

import { GithubAuthProvider, GoogleAuthProvider, getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

const credentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = firebase.initializeApp(credentials);

export default firebaseApp;

export const firebaseUiConfig: firebaseui.auth.Config = {
  signInSuccessUrl: '/',
  signInOptions: [
    GithubAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      const userId = authResult.user.uid;
      const q = query(
        collection(firebaseDB, 'users'),
        where('userId', '==', userId),
      );

      getDocs(q).then(res => {
        if (!res.docs.length) {
          const ref = doc(collection(firebaseDB, 'users'));
          setDoc(ref, { userId });
        }
      });

      return false;
    },
  },
};

export const firebaseAuth = getAuth(firebaseApp);

export const firebaseDB = getFirestore(firebaseApp);
