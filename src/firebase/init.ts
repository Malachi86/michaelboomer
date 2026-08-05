'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase services.
 * Returns null if running on the server to prevent SSR errors.
 */
export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
} | null {
  // Defensive check for window object
  if (typeof window === 'undefined') return null;

  // Ensure we have a valid API key before initializing
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
    console.warn('Firebase API Key is missing. Check your src/firebase/config.ts file.');
    return null;
  }

  try {
    const firebaseApp =
      getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    const firestore = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    const storage = getStorage(firebaseApp);

    return { firebaseApp, firestore, auth, storage };
  } catch (error: any) {
    console.error('Error during Firebase SDK initialization:', error);
    throw error;
  }
}
