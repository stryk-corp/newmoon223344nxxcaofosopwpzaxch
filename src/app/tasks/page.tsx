'use client';

import { useState, useTransition, useMemo } from 'react';
import { tasks } from '@/lib/tasks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { completeTaskAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Icon } from '@/components/icons';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { User } from '@/lib/types';


export default function TasksPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const userDocRef = useMemo(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile, loading: profileLoading } = useDoc<User>(userDocRef);

  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const completedTasks = userProfile?.completedTasks || [];

  const handleTaskClick = (task: (typeof tasks)[0]) => {
    if (!user) {
        toast({
            title: "Not Logged In",
            description: "You need to be logged in to complete tasks.",
            variant: "destructive",
        })
        return;
    }
    if (completedTasks.includes(task.id)) return;

    setPendingTaskId(task.id);
    startTransition(async () => {
      const result = await completeTaskAction({ taskId: task.id, reward: task.reward, userId: user.uid });
      if (result?.message && result?.taskId) {
        toast({
          title: 'Task Completed!',
          description: result.message,
        });
      } else if (result?.message) {
        toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive',
        })
      }
      setPendingTaskId(null);
    });

    if (task.link !== '/profile') {
        window.open(task.link, '_blank', 'noopener,noreferrer');
    }
  };
  
  if (userLoading || profileLoading) {
      return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Airdrop Tasks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id);
          const isTaskPending = pendingTaskId === task.id && isPending;

          return (
            <Card key={task.id} className="flex flex-col">
              <CardHeader className="flex-row gap-4 items-center">
                <Icon name={task.icon} className="w-10 h-10 text-accent" />
                <div>
                  <CardTitle>{task.title}</CardTitle>
                  <CardDescription>Reward: {task.reward.toLocaleString()} Tokens</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{task.description}</p>
              </CardContent>
              <CardFooter className="flex-col sm:flex-row justify-between items-center gap-2">
                <Button
                  variant={isCompleted ? "secondary" : "default"}
                  onClick={() => handleTaskClick(task)}
                  disabled={isCompleted || isTaskPending}
                  className="w-full"
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completed
                    </>
                  ) : isTaskPending ? (
                     <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                     </>
                  ) : (
                    <>
                      Go to Link <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
