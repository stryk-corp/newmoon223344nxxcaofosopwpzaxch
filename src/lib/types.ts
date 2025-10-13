export type TierName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export type Tier = {
  name: TierName;
  maxBalance: number;
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  balance: number;
  tier: TierName;
  ipAddress: string;
  status: 'active' | 'suspended' | 'banned';
  suspensionEndDate?: string;
  miningActivity: number[]; // timestamps
  referralCode: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  reward: number;
  link: string;
  icon: 'Twitter' | 'Send' | 'Users';
};
