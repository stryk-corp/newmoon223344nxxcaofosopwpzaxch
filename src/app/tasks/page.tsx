'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { tasks } from '@/lib/tasks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { completeTaskAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Icon } from '@/components/icons';

function SubmitButton({ completed }: { completed: boolean }) {
  const { pending } = useFormStatus();
  
  if (completed) {
    return (
      <Button disabled variant="secondary">
        <CheckCircle className="mr-2 h-4 w-4" />
        Completed
      </Button>
    );
  }

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Verifying...' : 'Complete Task'}
    </Button>
  );
}

export default function TasksPage() {
  const [state, formAction] = useActionState(completeTaskAction, null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message && state?.taskId) {
      toast({
        title: 'Task Completed!',
        description: state.message,
      });
      setCompletedTasks((prev) => [...prev, state.taskId as string]);
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Airdrop Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
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
            <CardFooter className="flex justify-between items-center">
              <Button variant="ghost" asChild>
                <a href={task.link} target="_blank" rel="noopener noreferrer">
                  Go to Link <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <form action={formAction}>
                <input type="hidden" name="taskId" value={task.id} />
                <input type="hidden" name="reward" value={task.reward} />
                <SubmitButton completed={completedTasks.includes(task.id)} />
              </form>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
