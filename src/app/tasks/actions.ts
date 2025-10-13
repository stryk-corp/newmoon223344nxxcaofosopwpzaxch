'use server';

import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { User } from '@/lib/types';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

const completeTaskSchema = z.object({
  taskId: z.string(),
  reward: z.coerce.number(),
  userId: z.string(), // This is now the wallet public key
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
  
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        return { message: 'User not found.' };
    }

    const userData = userSnap.data() as User;

    if (userData.completedTasks?.includes(taskId)) {
        return { message: 'Task already completed.' };
    }

    const updateData = {
        completedTasks: arrayUnion(taskId),
        balance: increment(reward)
    };

    await updateDoc(userRef, updateData)
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
        // Re-throw or handle as needed, here we'll let the client know it failed.
        throw error;
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
