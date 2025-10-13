import type { Task } from '@/lib/types';

export const tasks: Task[] = [
  {
    id: 'task_1',
    title: 'Follow us on X',
    description: 'Stay up to date with the latest announcements.',
    reward: 10000,
    link: '#',
    icon: 'Twitter',
  },
  {
    id: 'task_2',
    title: 'Join our Telegram',
    description: 'Join our community and get involved.',
    reward: 10000,
    link: '#',
    icon: 'Send',
  },
  {
    id: 'task_3',
    title: 'Refer a Friend',
    description: 'Invite your friends and earn more.',
    reward: 25000,
    link: '/profile',
    icon: 'Users',
  },
];
