'use server';
/**
 * @fileOverview Fraud detection AI agent for monitoring unusual account activities.
 *
 * - detectFraud - A function that detects fraudulent mining activities.
 * - FraudDetectionInput - The input type for the detectFraud function.
 * - FraudDetectionOutput - The return type for the detectFraud function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FraudDetectionInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  miningActivity: z.array(z.number()).describe('An array of mining activity timestamps.'),
  balance: z.number().describe('The current balance of the user.'),
  ipAddress: z.string().describe('The IP address of the user.'),
});
export type FraudDetectionInput = z.infer<typeof FraudDetectionInputSchema>;

const FraudDetectionOutputSchema = z.object({
  isSuspicious: z.boolean().describe('Whether the user activity is suspicious.'),
  reason: z.string().describe('The reason for the suspicious activity, if any.'),
});
export type FraudDetectionOutput = z.infer<typeof FraudDetectionOutputSchema>;

export async function detectFraud(input: FraudDetectionInput): Promise<FraudDetectionOutput> {
  return detectFraudFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fraudDetectionPrompt',
  input: {schema: FraudDetectionInputSchema},
  output: {schema: FraudDetectionOutputSchema},
  prompt: `You are an expert in fraud detection for a cryptocurrency mining platform.

You will analyze user mining activity, balance, and IP address to identify potentially fraudulent behavior.

Consider the following factors:
- Sudden spikes in mining activity.
- Unusually high balance compared to mining activity.
- Multiple accounts from the same IP address.

Based on your analysis, determine if the user activity is suspicious and provide a reason.

User ID: {{{userId}}}
Mining Activity: {{{miningActivity}}}
Current Balance: {{{balance}}}
IP Address: {{{ipAddress}}}

Output a JSON object indicating whether the activity is suspicious and the reason.
`,
});

const detectFraudFlow = ai.defineFlow(
  {
    name: 'detectFraudFlow',
    inputSchema: FraudDetectionInputSchema,
    outputSchema: FraudDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
