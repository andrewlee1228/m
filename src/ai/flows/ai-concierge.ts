'use server';

/**
 * @fileOverview AI concierge service for Stay users, providing personalized recommendations for local restaurants,
 * attractions, and services based on user interests and preferences.
 *
 * - aiConciergeForStayUsers - A function that provides personalized recommendations for Stay users.
 * - AiConciergeInput - The input type for the aiConciergeForStayUsers function.
 * - AiConciergeOutput - The return type for the aiConciergeForStayUsers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiConciergeInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma-separated list of interests and preferences of the user.'),
  location: z.string().describe('The current location of the user.'),
  stayDuration: z
    .string()
    .describe('The duration of the user stay (e.g., 1 day, 3 days, 1 week).'),
});
export type AiConciergeInput = z.infer<typeof AiConciergeInputSchema>;

const AiConciergeOutputSchema = z.object({
  restaurants: z.array(z.string()).describe('A list of recommended restaurants.'),
  attractions: z.array(z.string()).describe('A list of recommended attractions.'),
  services: z.array(z.string()).describe('A list of recommended services.'),
});
export type AiConciergeOutput = z.infer<typeof AiConciergeOutputSchema>;

export async function aiConciergeForStayUsers(
  input: AiConciergeInput
): Promise<AiConciergeOutput> {
  return aiConciergeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiConciergePrompt',
  input: {schema: AiConciergeInputSchema},
  output: {schema: AiConciergeOutputSchema},
  prompt: `You are an AI concierge service for short-term stay users. Based on the user's interests, location, and stay duration, provide personalized recommendations for local restaurants, attractions, and services.

User Interests: {{{interests}}}
Location: {{{location}}}
Stay Duration: {{{stayDuration}}}

Respond in JSON format:
`,
});

const aiConciergeFlow = ai.defineFlow(
  {name: 'aiConciergeFlow', inputSchema: AiConciergeInputSchema, outputSchema: AiConciergeOutputSchema},
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
