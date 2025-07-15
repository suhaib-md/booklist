'use server';

/**
 * @fileOverview Generates personalized reading suggestions based on the user's reading list.
 *
 * - generateReadingSuggestions - A function that generates reading suggestions.
 * - GenerateReadingSuggestionsInput - The input type for the generateReadingSuggestions function.
 * - GenerateReadingSuggestionsOutput - The return type for the generateReadingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReadingSuggestionsInputSchema = z.object({
  readingList: z
    .string()
    .describe('A list of books the user has read, is reading, or plans to read.'),
});
export type GenerateReadingSuggestionsInput = z.infer<
  typeof GenerateReadingSuggestionsInputSchema
>;

const GenerateReadingSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('A list of personalized reading suggestions based on the reading list.'),
});
export type GenerateReadingSuggestionsOutput = z.infer<
  typeof GenerateReadingSuggestionsOutputSchema
>;

export async function generateReadingSuggestions(
  input: GenerateReadingSuggestionsInput
): Promise<GenerateReadingSuggestionsOutput> {
  return generateReadingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReadingSuggestionsPrompt',
  input: {schema: GenerateReadingSuggestionsInputSchema},
  output: {schema: GenerateReadingSuggestionsOutputSchema},
  prompt: `You are a book recommendation expert. Based on the user's current reading list, provide personalized reading suggestions.\n\nReading List: {{{readingList}}}\n\nSuggestions:`,
});

const generateReadingSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateReadingSuggestionsFlow',
    inputSchema: GenerateReadingSuggestionsInputSchema,
    outputSchema: GenerateReadingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
