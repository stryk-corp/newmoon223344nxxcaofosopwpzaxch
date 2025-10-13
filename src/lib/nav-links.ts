import { icons } from 'lucide-react';

export type NavLink = {
  id: string;
  label: string;
  path: string;
  icon: keyof typeof icons;
};

export const navLinks: NavLink[] = [
  { id: 'home', label: 'Home', path: '/', icon: 'Home' },
  { id: 'tasks', label: 'Tasks', path: '/tasks', icon: 'ListChecks' },
  { id: 'rankings', label: 'Rankings', path: '/rankings', icon: 'BarChart3' },
  { id: 'withdraw', label: 'Withdraw', path: '/withdraw', icon: 'Banknote' },
  { id: 'profile', label: 'Profile', path: '/profile', icon: 'User' },
  { id: 'admin', label: 'Admin', path: '/admin', icon: 'Shield' },
];
