'use server';
/**
 * @fileOverview Generates community event ideas based on resident demographics, interests, and available facilities.
 *
 * - generateCommunityEventIdeas - A function that generates community event ideas.
 * - GenerateCommunityEventIdeasInput - The input type for the generateCommunityEventIdeas function.
 * - GenerateCommunityEventIdeasOutput - The return type for the generateCommunityEventIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCommunityEventIdeasInputSchema = z.object({
  residentDemographics: z
    .string()
    .describe('Description of the resident demographics in the community.'),
  residentInterests: z
    .string()
    .describe('Description of the interests of the residents in the community.'),
  availableFacilities: z
    .string()
    .describe('Description of the available facilities in the community.'),
});
export type GenerateCommunityEventIdeasInput = z.infer<
  typeof GenerateCommunityEventIdeasInputSchema
>;

const GenerateCommunityEventIdeasOutputSchema = z.object({
  eventIdeas: z
    .array(z.string())
    .describe('A list of community event ideas.'),
});
export type GenerateCommunityEventIdeasOutput = z.infer<
  typeof GenerateCommunityEventIdeasOutputSchema
>;

export async function generateCommunityEventIdeas(
  input: GenerateCommunityEventIdeasInput
): Promise<GenerateCommunityEventIdeasOutput> {
  return generateCommunityEventIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCommunityEventIdeasPrompt',
  input: {schema: GenerateCommunityEventIdeasInputSchema},
  output: {schema: GenerateCommunityEventIdeasOutputSchema},
  prompt: `You are a community manager tasked with generating event ideas for residents.\n\n  Consider the following information about the residents and available facilities to come up with creative and engaging event ideas.\n\n  Resident Demographics: {{{residentDemographics}}}\n  Resident Interests: {{{residentInterests}}}\n  Available Facilities: {{{availableFacilities}}}\n\n  Generate a list of community event ideas that would appeal to the residents and make use of the available facilities.\n  Each idea should be concise and easy to understand. Return the eventIdeas output as a JSON array of strings.\n  `,
});

const generateCommunityEventIdeasFlow = ai.defineFlow(
  {
    name: 'generateCommunityEventIdeasFlow',
    inputSchema: GenerateCommunityEventIdeasInputSchema,
    outputSchema: GenerateCommunityEventIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
