'use server';

/**
 * @fileOverview Generates a book cover image using AI.
 *
 * - generateBookCover - A function that generates a book cover.
 * - GenerateBookCoverInput - The input type for the generateBookCover function.
 * - GenerateBookCoverOutput - The return type for the generateBookCover function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBookCoverInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  synopsis: z.string().describe('A short synopsis of the book.'),
});
export type GenerateBookCoverInput = z.infer<typeof GenerateBookCoverInputSchema>;

const GenerateBookCoverOutputSchema = z.object({
  coverImage: z.string().describe("The generated book cover image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateBookCoverOutput = z.infer<typeof GenerateBookCoverOutputSchema>;

export async function generateBookCover(input: GenerateBookCoverInput): Promise<GenerateBookCoverOutput> {
  return generateBookCoverFlow(input);
}

const generateBookCoverFlow = ai.defineFlow(
  {
    name: 'generateBookCoverFlow',
    inputSchema: GenerateBookCoverInputSchema,
    outputSchema: GenerateBookCoverOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a visually stunning, artistic, and abstract book cover for a book titled "${input.title}". The cover should evoke the mood and themes from the following synopsis: ${input.synopsis}. Do not include any text or words on the cover. The style should be minimalist and modern.`,
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    if (!media || !media.url) {
        throw new Error("Image generation failed.");
    }
    
    return {
        coverImage: media.url,
    };
  }
);
