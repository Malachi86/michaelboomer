'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  Firestore,
  getFirestore
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase services with Persistent Caching to save on reads.
 * Returns null if running on the server to prevent SSR errors.
 */
export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
} | null {
  if (typeof window === 'undefined') return null;

  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
    console.warn('Firebase API Key is missing. Check your src/firebase/config.ts file.');
    return null;
  }

  try {
    const existingApps = getApps();
    const firebaseApp = existingApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Check if Firestore is already initialized to avoid "initializeFirestore() has already been called" error.
    // If the app exists, we attempt to get the existing Firestore instance.
    // If it's a new app initialization, we use initializeFirestore with persistent settings.
    let firestore: Firestore;
    if (existingApps.length > 0) {
      firestore = getFirestore(firebaseApp);
    } else {
      firestore = initializeFirestore(firebaseApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    }

    const auth = getAuth(firebaseApp);
    const storage = getStorage(firebaseApp);

    return { firebaseApp, firestore, auth, storage };
  } catch (error: any) {
    console.error('Error during Firebase SDK initialization:', error);
    throw error;
  }
}
