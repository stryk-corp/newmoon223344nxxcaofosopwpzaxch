'use client';

import { useEffect, useState, useTransition } from 'react';

import { tasks } from '@/lib/tasks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { completeTaskAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Icon } from '@/components/icons';

export default function TasksPage() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleTaskClick = (task: (typeof tasks)[0]) => {
    if (completedTasks.includes(task.id)) return;

    setPendingTaskId(task.id);
    startTransition(async () => {
      const result = await completeTaskAction({ taskId: task.id, reward: task.reward });
      if (result?.message && result?.taskId) {
        toast({
          title: 'Task Completed!',
          description: result.message,
        });
        setCompletedTasks((prev) => [...prev, result.taskId as string]);
      }
      setPendingTaskId(null);
    });

    window.open(task.link, '_blank', 'noopener,noreferrer');
  };

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
