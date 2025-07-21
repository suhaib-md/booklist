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
    .describe('A comma-separated list of book titles and authors that the user has read, is reading, or plans to read.'),
});
export type GenerateReadingSuggestionsInput = z.infer<
  typeof GenerateReadingSuggestionsInputSchema
>;

const SuggestionSchema = z.object({
    title: z.string().describe("The title of the suggested book."),
    author: z.string().describe("The author of the suggested book."),
    reason: z.string().describe("A brief explanation for why this book is recommended based on the user's reading list."),
});

const GenerateReadingSuggestionsOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).describe('A list of 3-5 personalized reading suggestions.'),
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
  prompt: `You are a book recommendation expert. Based on the user's current reading list, provide 3-5 personalized reading suggestions. For each suggestion, provide the book title, author, and a short, compelling reason why the user would enjoy it based on their existing list.

Reading List: {{{readingList}}}
`,
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
