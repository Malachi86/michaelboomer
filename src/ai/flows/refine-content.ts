'use server';
/**
 * @fileOverview A Genkit flow for refining text content using AI.
 *
 * - refineContent - A function that refines text content for clarity, impact, and conciseness.
 * - RefineContentInput - The input type for the refineContent function.
 * - RefineContentOutput - The return type for the refineContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RefineContentInputSchema = z.object({
  text: z.string().describe('The text content to be refined.'),
});
export type RefineContentInput = z.infer<typeof RefineContentInputSchema>;

const RefineContentOutputSchema = z.object({
  refinedText: z
    .string()
    .describe(
      'The AI-refined version of the input text, improved for clarity, impact, and conciseness.'
    ),
});
export type RefineContentOutput = z.infer<typeof RefineContentOutputSchema>;

export async function refineContent(input: RefineContentInput): Promise<RefineContentOutput> {
  return refineContentFlow(input);
}

const refineContentPrompt = ai.definePrompt({
  name: 'refineContentPrompt',
  input: { schema: RefineContentInputSchema },
  output: { schema: RefineContentOutputSchema },
  prompt: `You are an expert copywriter and editor. Your task is to refine the provided text to improve its clarity, impact, and conciseness.

Focus on:
- Making the language clearer and easier to understand.
- Enhancing the overall impact and engagement of the message.
- Removing any unnecessary words or phrases without losing essential information.
- Maintaining the original meaning and intent of the text.

Here is the text to refine: """{{{text}}}"""

Provide only the refined text in the specified JSON format.`,
});

const refineContentFlow = ai.defineFlow(
  {
    name: 'refineContentFlow',
    inputSchema: RefineContentInputSchema,
    outputSchema: RefineContentOutputSchema,
  },
  async (input) => {
    const { output } = await refineContentPrompt(input);
    return output!;
  }
);
