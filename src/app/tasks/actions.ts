'use server';

import { z } from 'zod';

const completeTaskSchema = z.object({
  taskId: z.string(),
  reward: z.coerce.number(),
});

export async function completeTaskAction(prevState: any, formData: FormData) {
  const validatedFields = completeTaskSchema.safeParse({
    taskId: formData.get('taskId'),
    reward: formData.get('reward'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid task data.',
    };
  }
  
  // In a real app, you would:
  // 1. Verify the user has not already completed this task.
  // 2. Verify the task completion (e.g., via an API call to X/Telegram).
  // 3. Add the reward to the user's balance in the database.
  // 4. Record the task completion for the user.
  
  console.log(`Task ${validatedFields.data.taskId} completed, reward ${validatedFields.data.reward} pseudo-awarded.`);

  return {
    message: `You earned ${validatedFields.data.reward.toLocaleString()} tokens!`,
    taskId: validatedFields.data.taskId,
  };
}
