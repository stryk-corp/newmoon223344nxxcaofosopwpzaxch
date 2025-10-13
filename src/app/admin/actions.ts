'use server';

import { detectFraud } from '@/ai/flows/fraud-detection';
import { revalidatePath } from 'next/cache';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';


async function getFirestore() {
    const { firestore } = await initializeFirebase();
    return firestore;
}

export async function checkFraudAction(userId: string) {
  try {
    const firestore = await getFirestore();
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, message: 'User not found.' };
    }
    const user = { id: userSnap.id, ...userSnap.data() } as User;

    const result = await detectFraud({
      userId: user.id,
      miningActivity: user.miningActivity,
      balance: user.balance,
      ipAddress: user.ipAddress,
    });

    if (result.isSuspicious) {
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
        const firestore = await getFirestore();
        const userRef = doc(firestore, 'users', userId);

        const updateData: Partial<User> = { status };

        if (status === 'suspended') {
            const fiveDays = 5 * 24 * 60 * 60 * 1000;
            updateData.suspensionEndDate = new Date(Date.now() + fiveDays).toISOString();
        } else {
            updateData.suspensionEndDate = undefined;
        }

        await updateDoc(userRef, updateData);

        console.log(`User ${userId} status updated to ${status}`);
        revalidatePath('/admin');
        return { success: true, message: `User status updated to ${status}.`};

    } catch(error) {
        console.error(error);
        return { success: false, message: 'Failed to update user status.'};
    }
}
