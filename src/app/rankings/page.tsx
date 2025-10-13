import { users } from '@/lib/data';
import { Leaderboard } from '@/components/rankings/leaderboard';

export default function RankingsPage() {
  const sortedUsers = [...users].sort((a, b) => b.balance - a.balance);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Leaderboard</h1>
      <Leaderboard allUsers={sortedUsers} />
    </div>
  );
}
