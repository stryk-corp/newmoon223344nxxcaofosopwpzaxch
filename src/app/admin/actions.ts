'use server';

import { detectFraud } from '@/ai/flows/fraud-detection';
import { revalidatePath } from 'next/cache';

// This will be replaced with Firestore access
const users: any[] = [];


export async function checkFraudAction(userId: string) {
  try {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    const result = await detectFraud({
      userId: user.id,
      miningActivity: user.miningActivity,
      balance: user.balance,
      ipAddress: user.ipAddress,
    });

    if (result.isSuspicious) {
        // Optionally, auto-ban or flag user
        console.log(`Suspicious activity for ${user.name}: ${result.reason}`);
    }

    return { success: true, result };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An error occurred during fraud check.' };
  }
}

export async function updateUserStatusAction(userId: string, status: 'active' | 'suspended' | 'banned') {
    try {
        const user = users.find((u) => u.id === userId);
        if (!user) {
            return { success: false, message: 'User not found.' };
        }
        
        user.status = status;
        if (status === 'suspended') {
            const fiveDays = 5 * 24 * 60 * 60 * 1000;
            user.suspensionEndDate = new Date(Date.now() + fiveDays).toISOString();
        } else {
            user.suspensionEndDate = undefined;
        }

        console.log(`User ${userId} status updated to ${status}`);
        revalidatePath('/admin');
        return { success: true, message: `User status updated to ${status}.`};

    } catch(error) {
        console.error(error);
        return { success: false, message: 'Failed to update user status.'};
    }
}
