
'use client';

import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy,
  Firestore
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/init';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import type { Profile, Skill, Project, Message, Analytics, Testimonial, Certificate } from '@/lib/types';

// Robust Firestore getter
const getFirestoreDb = (): Firestore | undefined => {
  const instances = initializeFirebase();
  return instances?.firestore;
};

// Generic error handler
const handlePermissionError = (path: string, operation: SecurityRuleContext['operation'], data?: any) => {
  const error = new FirestorePermissionError({
    path,
    operation,
    requestResourceData: data,
  });
  errorEmitter.emit('permission-error', error);
};

// --- Profile ---
export async function updateProfile(updatedProfile: Profile) {
  const db = getFirestoreDb();
  if (!db) return { success: false, error: 'Database not initialized' };
  
  const docRef = doc(db, 'profile', 'data');
  try {
    // Stringify/Parse to clean potential nested complex objects
    const payload = JSON.parse(JSON.stringify(updatedProfile));
    await setDoc(docRef, payload, { merge: true });
    return { success: true };
  } catch (err: any) {
    console.error('[Action] Profile Sync Error:', err);
    handlePermissionError(docRef.path, 'update', updatedProfile);
    return { success: false, error: err.message };
  }
}

// --- Skills ---
export async function addSkill(skill: Omit<Skill, 'id'>) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const colRef = collection(db, 'skills');
  try {
    const docRef = await addDoc(colRef, skill);
    return { success: true, id: docRef.id };
  } catch (err) {
    handlePermissionError(colRef.path, 'create', skill);
    return { success: false };
  }
}

export async function updateSkill(id: string, skillData: Partial<Skill>) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const docRef = doc(db, 'skills', id);
  try {
    await updateDoc(docRef, skillData);
    return { success: true };
  } catch (err) {
    handlePermissionError(docRef.path, 'update', skillData);
    return { success: false };
  }
}

export async function deleteSkill(id: string) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const docRef = doc(db, 'skills', id);
  try {
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    handlePermissionError(docRef.path, 'delete');
    return { success: false };
  }
}

// --- Projects ---
export async function addProject(project: Omit<Project, 'id'>) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const colRef = collection(db, 'projects');
  try {
    const docRef = await addDoc(colRef, project);
    return { success: true, id: docRef.id };
  } catch (err) {
    handlePermissionError(colRef.path, 'create', project);
    return { success: false };
  }
}

export async function updateProject(id: string, projectData: Partial<Project>) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const docRef = doc(db, 'projects', id);
  try {
    await updateDoc(docRef, projectData);
    return { success: true };
  } catch (err) {
    handlePermissionError(docRef.path, 'update', projectData);
    return { success: false };
  }
}

export async function deleteProject(id: string) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const docRef = doc(db, 'projects', id);
  try {
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    handlePermissionError(docRef.path, 'delete');
    return { success: false };
  }
}

// --- Certificates ---
export async function addCertificate(cert: Omit<Certificate, 'id'>) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const colRef = collection(db, 'certificates');
  try {
    const docRef = await addDoc(colRef, cert);
    return { success: true, id: docRef.id };
  } catch (err) {
    handlePermissionError(colRef.path, 'create', cert);
    return { success: false };
  }
}

export async function updateCertificate(id: string, certData: Partial<Certificate>) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const docRef = doc(db, 'certificates', id);
  try {
    await updateDoc(docRef, certData);
    return { success: true };
  } catch (err) {
    handlePermissionError(docRef.path, 'update', certData);
    return { success: false };
  }
}

export async function deleteCertificate(id: string) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const docRef = doc(db, 'certificates', id);
  try {
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    handlePermissionError(docRef.path, 'delete');
    return { success: false };
  }
}

// --- Testimonials ---
export async function submitTestimonial(testimonial: Omit<Testimonial, 'id' | 'approved' | 'createdAt'>) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const colRef = collection(db, 'testimonials');
  const newTestimonial = {
    ...testimonial,
    approved: false,
    createdAt: new Date().toISOString()
  };
  try {
    await addDoc(colRef, newTestimonial);
    return { success: true };
  } catch (err) {
    handlePermissionError(colRef.path, 'create', newTestimonial);
    return { success: false };
  }
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const docRef = doc(db, 'testimonials', id);
  try {
    await updateDoc(docRef, updates);
    return { success: true };
  } catch (err) {
    handlePermissionError(docRef.path, 'update', updates);
    return { success: false };
  }
}

export async function deleteTestimonial(id: string) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const docRef = doc(db, 'testimonials', id);
  try {
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    handlePermissionError(docRef.path, 'delete');
    return { success: false };
  }
}

// --- Messages ---
export async function updateMessage(id: string, data: { read: boolean }) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const docRef = doc(db, 'messages', id);
  try {
    await updateDoc(docRef, data);
    return { success: true };
  } catch (err) {
    handlePermissionError(docRef.path, 'update', data);
    return { success: false };
  }
}

export async function deleteMessage(id: string) {
  const db = getFirestoreDb();
  if (!db) return { success: false };
  const docRef = doc(db, 'messages', id);
  try {
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    handlePermissionError(docRef.path, 'delete');
    return { success: false };
  }
}

// --- Analytics ---
export async function getAnalytics() {
  const db = getFirestoreDb();
  if (!db) return [];
  try {
    const q = query(collection(db, 'analytics'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Analytics[];
  } catch (err) {
    console.error('[Get Analytics Error]:', err);
    return [];
  }
}

// --- Getters ---
export async function getProfile() {
  const db = getFirestoreDb();
  if (!db) return null;
  try {
    const docRef = doc(db, 'profile', 'data');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as Profile : null;
  } catch (err) {
    return null;
  }
}

export async function getSkills() {
  const db = getFirestoreDb();
  if (!db) return [];
  try {
    const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Skill[];
  } catch (err) {
    return [];
  }
}

export async function getProjects() {
  const db = getFirestoreDb();
  if (!db) return [];
  try {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
  } catch (err) {
    return [];
  }
}

export async function getCertificates() {
  const db = getFirestoreDb();
  if (!db) return [];
  try {
    const q = query(collection(db, 'certificates'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Certificate[];
  } catch (err) {
    return [];
  }
}

export async function getTestimonials() {
  const db = getFirestoreDb();
  if (!db) return [];
  try {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Testimonial[];
  } catch (err) {
    return [];
  }
}

export async function getMessages() {
  const db = getFirestoreDb();
  if (!db) return [];
  try {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
  } catch (err) {
    return [];
  }
}
