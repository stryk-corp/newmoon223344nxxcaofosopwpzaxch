'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ListChecks, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const earningOptions = [
  {
    title: 'Complete Tasks',
    description: 'Earn tokens by completing simple tasks.',
    icon: ListChecks,
    link: '/tasks',
    cta: 'View Tasks',
  },
  {
    title: 'Invite Friends',
    description: 'Get a percentage of your friends\' earnings when they join through your link.',
    icon: Users,
    link: '/referrals',
    cta: 'Get Your Link',
  }
]

export default function EarnPage() {
  // This will be controlled by an admin setting in a real application
  const [isBoostEnabled, setIsBoostEnabled] = useState(false);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Ways to Earn</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {earningOptions.map((option) => (
          <Card key={option.title} className="flex flex-col">
            <CardHeader className="flex-row gap-4 items-center">
              <option.icon className="w-10 h-10 text-accent" />
              <div>
                <CardTitle>{option.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{option.description}</p>
            </CardContent>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={option.link}>
                  {option.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}

        {isBoostEnabled && (
          <Card className="flex flex-col border-accent/50 bg-primary/10">
            <CardHeader className="flex-row gap-4 items-center">
              <Zap className="w-10 h-10 text-accent" />
              <div>
                <CardTitle>Boost Your Mining</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">Permanently increase your base mining rate by paying a one-time fee of 0.055 SOL.</p>
            </CardContent>
            <CardContent>
              <Button className="w-full" variant="secondary">
                Boost for 0.055 SOL <Zap className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
