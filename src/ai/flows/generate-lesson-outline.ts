'use server';
/**
 * @fileOverview An AI Lesson Assistant that generates a detailed lesson outline.
 *
 * - generateLessonOutline - A function that handles the lesson outline generation process.
 * - GenerateLessonOutlineInput - The input type for the generateLessonOutline function.
 * - GenerateLessonOutlineOutput - The return type for the generateLessonOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonOutlineInputSchema = z.object({
  topic: z.string().describe('The main topic of the course or lesson.'),
  audience: z
    .string()
    .describe('The target audience for the lesson (e.g., 