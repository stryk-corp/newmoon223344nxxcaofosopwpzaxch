'use client';

import { Leaderboard } from '@/components/rankings/leaderboard';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { User } from '@/lib/types';
import { collection, getFirestore, query, orderBy } from 'firebase/firestore';


export default function RankingsPage() {
  const firestore = getFirestore();
  const usersQuery = firestore ? query(collection(firestore, 'users'), orderBy('balance', 'desc')) : null;
  const { data: users, loading } = useCollection<User>(usersQuery);

  if (loading) {
    return <div>Loading...</div>
  }

  const sortedUsers = users || [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Leaderboard</h1>
      <Leaderboard allUsers={sortedUsers} />
    </div>
  );
}
