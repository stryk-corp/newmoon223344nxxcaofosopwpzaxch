'use server';

import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { User } from '@/lib/types';

const completeTaskSchema = z.object({
  taskId: z.string(),
  reward: z.coerce.number(),
  userId: z.string(),
});

type CompleteTaskInput = z.infer<typeof completeTaskSchema>;

export async function completeTaskAction(input: CompleteTaskInput) {
  const validatedFields = completeTaskSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      message: 'Invalid task data.',
    };
  }

  const { taskId, reward, userId } = validatedFields.data;
  const { firestore } = await initializeFirebase();
  
  // In a real app, you would also:
  // 1. Verify the task completion (e.g., via an API call to X/Telegram).

  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        return { message: 'User not found.' };
    }

    const userData = userSnap.data() as User;

    // Check if the task has already been completed
    if (userData.completedTasks?.includes(taskId)) {
        return { message: 'Task already completed.' };
    }

    await updateDoc(userRef, {
        completedTasks: arrayUnion(taskId),
        balance: increment(reward)
    });

    revalidatePath('/tasks');

    return {
        message: `You earned ${reward.toLocaleString()} tokens!`,
        taskId: taskId,
      };

  } catch (error) {
      console.error("Error completing task:", error);
      return {
          message: 'An error occurred while completing the task.'
      }
  }
}
