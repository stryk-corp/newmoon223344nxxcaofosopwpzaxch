import { MiningSection } from '@/components/mining-section';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Gift, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      <MiningSection />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Mining Rate
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">+0.001/s</div>
            <p className="text-xs text-muted-foreground">
              Base rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Airdrop Tasks</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">3 Available</div>
            <p className="text-xs text-muted-foreground">
              Complete tasks to earn more
            </p>
          </CardContent>
        </Card>
        <Card className="md:col-span-1 bg-primary/20 border-accent/50 flex flex-col justify-center items-start">
            <CardHeader>
                <CardTitle>View All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                <Button asChild variant="ghost" className="text-accent hover:bg-accent/20">
                    <Link href="/tasks">
                        Go to Tasks <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
