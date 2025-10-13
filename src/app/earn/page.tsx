import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EarnPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Earn</h1>
       <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This page is under construction.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>More ways to earn are coming soon. Stay tuned!</p>
        </CardContent>
      </Card>
    </div>
  );
}
