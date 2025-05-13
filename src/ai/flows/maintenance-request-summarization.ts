'use server';
/**
 * @fileOverview Summarizes maintenance requests for property managers.
 *
 * - summarizeMaintenanceRequests - A function that summarizes maintenance requests.
 * - SummarizeMaintenanceRequestsInput - The input type for the summarizeMaintenanceRequests function.
 * - SummarizeMaintenanceRequestsOutput - The return type for the summarizeMaintenanceRequests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMaintenanceRequestsInputSchema = z.object({
  requests: z
    .string()
    .describe('A list of maintenance requests to summarize.'),
});
export type SummarizeMaintenanceRequestsInput = z.infer<typeof SummarizeMaintenanceRequestsInputSchema>;

const SummarizeMaintenanceRequestsOutputSchema = z.object({
  summary: z.string().describe('A summary of the maintenance requests.'),
});
export type SummarizeMaintenanceRequestsOutput = z.infer<typeof SummarizeMaintenanceRequestsOutputSchema>;

export async function summarizeMaintenanceRequests(
  input: SummarizeMaintenanceRequestsInput
): Promise<SummarizeMaintenanceRequestsOutput> {
  return summarizeMaintenanceRequestsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMaintenanceRequestsPrompt',
  input: {schema: SummarizeMaintenanceRequestsInputSchema},
  output: {schema: SummarizeMaintenanceRequestsOutputSchema},
  prompt: `You are a property manager. Please summarize the following maintenance requests so that I can quickly understand the issue and prioritize tasks efficiently. 

Maintenance Requests: {{{requests}}}`,
});

const summarizeMaintenanceRequestsFlow = ai.defineFlow(
  {
    name: 'summarizeMaintenanceRequestsFlow',
    inputSchema: SummarizeMaintenanceRequestsInputSchema,
    outputSchema: SummarizeMaintenanceRequestsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
