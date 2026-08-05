'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './init';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';
import { Loader2, AlertCircle, RefreshCcw, ExternalLink } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const [firebase, setFirebase] = useState<{
    firebaseApp: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
    storage: FirebaseStorage;
  } | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const instances = initializeFirebase();
        if (instances) {
          setFirebase(instances);
        } else {
          setError({ 
            message: 'Firebase configuration is missing. Please check your config.ts file.',
            code: 'config-missing'
          });
        }
      } catch (err: any) {
        console.error('Firebase Initialization Error:', err);
        setError({ 
          message: err.message || 'An error occurred while initializing Firebase.',
          code: err.code 
        });
      } finally {
        setIsInitializing(false);
      }
    }
    init();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Initializing Firebase services...</p>
      </div>
    );
  }

  if (error || !firebase) {
    const isUnavailable = error?.message.toLowerCase().includes('unavailable') || error?.code === 'unavailable';
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md border-destructive/20 bg-destructive/5 py-8">
          <AlertCircle className="h-6 w-6" />
          <AlertTitle className="text-xl font-bold mb-4">
            {isUnavailable ? 'Firestore Backend Unavailable' : 'Firebase Error'}
          </AlertTitle>
          <AlertDescription className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              {isUnavailable 
                ? "Hindi maabot ang Firestore backend. Siguraduhin na ang iyong internet ay stable at ang Firestore database ay naka-provision na sa iyong Firebase Console."
                : (error?.message || 'Could not initialize Firebase services.')}
            </p>
            
            <div className="flex flex-col gap-3">
              <Button 
                variant="outline" 
                className="w-full justify-start border-white/10 hover:bg-white/5"
                onClick={() => window.location.reload()}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry Connection
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-white/10 hover:bg-white/5"
                asChild
              >
                <a href={`https://console.firebase.google.com/project/myportfolio-48bb2/firestore`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Firebase Console
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={firebase.firebaseApp} 
      firestore={firebase.firestore} 
      auth={firebase.auth}
      storage={firebase.storage}
    >
      {children}
    </FirebaseProvider>
  );
}
