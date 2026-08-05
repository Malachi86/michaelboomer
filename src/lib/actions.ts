'use client';

import { collection, addDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { z } from 'zod';

const db = initializeFirebase()?.firestore;

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type ContactFormState = {
  message: string;
  issues?: string[];
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const validatedFields = contactSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "error",
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  const { firstName, lastName, email, message } = validatedFields.data;

  // Admin backdoor logic
  if (
    firstName.toLowerCase() === 'admin' &&
    email === 'orozcomarvinpaul@gmail.com' &&
    message === 'ha pogi ako'
  ) {
    return { message: 'admin_redirect' };
  }

  if (!db) return { message: "error" };

  try {
    await addDoc(collection(db, 'messages'), {
      name: `${firstName} ${lastName || ''}`.trim(),
      email,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    });
    
    return { message: "success" };
  } catch (error) {
    console.error('Submission error:', error);
    return { message: "error" };
  }
}

export async function trackAnalytics(event: any) {
  if (!db) return;
  try {
    await addDoc(collection(db, 'analytics'), {
      ...event,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    // Silent fail for analytics
  }
}
