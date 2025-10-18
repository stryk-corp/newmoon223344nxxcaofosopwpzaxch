import type { Task } from '@/lib/types';

export const tasks: Task[] = [
  {
    id: 'task_1',
    title: 'Subscribe on Youtube',
    description: 'Stay up to date with the latest announcements.',
    reward: 100,
    link: 'https://youtube.com/@codemerchant',
    icon: 'Youtube',
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
