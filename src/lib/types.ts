import { z } from 'zod';

export type TierName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export type Tier = {
  name: TierName;
  maxBalance: number;
};

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().url().optional(),
  balance: z.number(),
  miningRate: z.number(),
  tier: z.enum(['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond']),
  ipAddress: z.string(),
  status: z.enum(['active', 'suspended', 'banned']),
  suspensionEndDate: z.string().optional(),
  miningActivity: z.array(z.number()),
  referralCode: z.string(),
  completedTasks: z.array(z.string()).optional(),
  referredBy: z.string().optional(),
  referrals: z.array(z.string()).optional(),
  referralCount: z.number().optional(),
});

export type User = z.infer<typeof UserSchema>;


export type Task = {
  id: string;
  title: string;
  description: string;
  reward: number;
  link: string;
  icon: 'Twitter' | 'Send' | 'Users';
};
