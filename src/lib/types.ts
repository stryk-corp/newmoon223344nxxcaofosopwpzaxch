export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  balance: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
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
