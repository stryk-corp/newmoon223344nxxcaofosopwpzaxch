import type { Tier } from '@/lib/types';

export const tiers: Tier[] = [
  { name: 'Bronze', maxBalance: 1000 },
  { name: 'Silver', maxBalance: 10000 },
  { name: 'Gold', maxBalance: 100000 },
  { name: 'Platinum', maxBalance: 1000000 },
  { name: 'Diamond', maxBalance: Infinity },
];
