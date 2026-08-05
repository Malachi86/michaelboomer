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
  orderBy 
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/init';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import type { Profile, Skill, Project, Message, Analytics, Testimonial, Certificate } from '@/lib/types';

const db = initializeFirebase()?.firestore;

// Helper to handle permission errors
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
  if (!db) return { success: false };
  const docRef = doc(db, 'profile', 'data');
  setDoc(docRef, updatedProfile, { merge: true })
    .catch(() => handlePermissionError(docRef.path, 'update', updatedProfile));
  return { success: true };
}

// --- Skills ---
export async function addSkill(skill: Omit<Skill, 'id'>) {
  if (!db) return { success: false };
  const colRef = collection(db, 'skills');
  addDoc(colRef, skill)
    .catch(() => handlePermissionError(colRef.path, 'create', skill));
  return { success: true };
}

export async function updateSkill(id: string, skillData: Partial<Skill>) {
  if (!db) return { success: false };
  const docRef = doc(db, 'skills', id);
  updateDoc(docRef, skillData)
    .catch(() => handlePermissionError(docRef.path, 'update', skillData));
  return { success: true };
}

export async function deleteSkill(id: string) {
  if (!db) return { success: false };
  const docRef = doc(db, 'skills', id);
  deleteDoc(docRef)
    .catch(() => handlePermissionError(docRef.path, 'delete'));
  return { success: true };
}

// --- Projects ---
export async function addProject(project: Omit<Project, 'id'>) {
  if (!db) return { success: false };
  const colRef = collection(db, 'projects');
  addDoc(colRef, project)
    .catch(() => handlePermissionError(colRef.path, 'create', project));
  return { success: true };
}

export async function updateProject(id: string, projectData: Partial<Project>) {
  if (!db) return { success: false };
  const docRef = doc(db, 'projects', id);
  updateDoc(docRef, projectData)
    .catch(() => handlePermissionError(docRef.path, 'update', projectData));
  return { success: true };
}

export async function deleteProject(id: string) {
  if (!db) return { success: false };
  const docRef = doc(db, 'projects', id);
  deleteDoc(docRef)
    .catch(() => handlePermissionError(docRef.path, 'delete'));
  return { success: true };
}

// --- Certificates ---
export async function addCertificate(cert: Omit<Certificate, 'id'>) {
  if (!db) return { success: false };
  const colRef = collection(db, 'certificates');
  addDoc(colRef, cert)
    .catch(() => handlePermissionError(colRef.path, 'create', cert));
  return { success: true };
}

export async function updateCertificate(id: string, certData: Partial<Certificate>) {
  if (!db) return { success: false };
  const docRef = doc(db, 'certificates', id);
  updateDoc(docRef, certData)
    .catch(() => handlePermissionError(docRef.path, 'update', certData));
  return { success: true };
}

export async function deleteCertificate(id: string) {
  if (!db) return { success: false };
  const docRef = doc(db, 'certificates', id);
  deleteDoc(docRef)
    .catch(() => handlePermissionError(docRef.path, 'delete'));
  return { success: true };
}

// --- Testimonials ---
export async function submitTestimonial(testimonial: Omit<Testimonial, 'id' | 'approved' | 'createdAt'>) {
  if (!db) return { success: false };
  const colRef = collection(db, 'testimonials');
  const newTestimonial = {
    ...testimonial,
    approved: false,
    createdAt: new Date().toISOString()
  };
  addDoc(colRef, newTestimonial)
    .catch(() => handlePermissionError(colRef.path, 'create', newTestimonial));
  return { success: true };
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  if (!db) return { success: false };
  const docRef = doc(db, 'testimonials', id);
  updateDoc(docRef, updates)
    .catch(() => handlePermissionError(docRef.path, 'update', updates));
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  if (!db) return { success: false };
  const docRef = doc(db, 'testimonials', id);
  deleteDoc(docRef)
    .catch(() => handlePermissionError(docRef.path, 'delete'));
  return { success: true };
}

// --- Messages ---
export async function updateMessage(id: string, data: { read: boolean }) {
  if (!db) return { success: false };
  const docRef = doc(db, 'messages', id);
  updateDoc(docRef, data)
    .catch(() => handlePermissionError(docRef.path, 'update', data));
  return { success: true };
}

export async function deleteMessage(id: string) {
  if (!db) return { success: false };
  const docRef = doc(db, 'messages', id);
  deleteDoc(docRef)
    .catch(() => handlePermissionError(docRef.path, 'delete'));
  return { success: true };
}

// --- Analytics ---
export async function getAnalytics() {
  if (!db) return [];
  const q = query(collection(db, 'analytics'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Analytics[];
}

// --- Getters ---
export async function getProfile() {
  if (!db) return null;
  const docRef = doc(db, 'profile', 'data');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as Profile : null;
}

export async function getSkills() {
  if (!db) return [];
  const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Skill[];
}

export async function getProjects() {
  if (!db) return [];
  const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
}

export async function getCertificates() {
  if (!db) return [];
  const q = query(collection(db, 'certificates'), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Certificate[];
}

export async function getTestimonials() {
  if (!db) return [];
  const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Testimonial[];
}

export async function getMessages() {
  if (!db) return [];
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
}
