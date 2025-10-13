import { Leaderboard } from '@/components/rankings/leaderboard';

// This will be replaced with Firestore access
const users: any[] = [];


export default function RankingsPage() {
  const sortedUsers = [...users].sort((a, b) => b.balance - a.balance);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Leaderboard</h1>
      <Leaderboard allUsers={sortedUsers} />
    </div>
  );
}
