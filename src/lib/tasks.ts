import type { Task } from '@/lib/types';

export const tasks: Task[] = [
  {
    id: 'task_1',
    title: 'Follow us on X',
    description: 'Stay up to date with the latest announcements.',
    reward: 100,
    link: 'https://x.com/firebase',
    icon: 'Twitter',
  },
  {
    id: 'task_2',
    title: 'Join our Telegram',
    description: 'Join our community and get involved.',
    reward: 100,
    link: 'https://t.me/firebase',
    icon: 'Send',
  },
  {
    id: 'task_3',
    title: 'Refer a Friend',
    description: 'Invite your friends and earn more.',
    reward: 250,
    link: '/referrals',
    icon: 'Users',
  },
];
