'use server'

import { adminClient } from '../sanity/adminClient';

export async function syncUserToSanity(user: {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}) {
  if (!user.id || !user.email) return { success: false, error: 'Missing user data' };

  try {
    const customerId = `customer-${user.id}`;

    // Use a transaction to ensure document exists, then patch it with latest info
    await adminClient.transaction()
      .createIfNotExists({
        _type: 'customer',
        _id: customerId,
        email: user.email,
        clerkUserId: user.id,
        createdAt: new Date().toISOString(),
      })
      .patch(customerId, (p) => p.set({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
        profilePicture: user.imageUrl || undefined,
      }))
      .commit();

    return { success: true, message: 'User synced successfully' };
  } catch (error) {
    console.error('Sync Error:', error);
    return { success: false, error: 'Failed to sync user' };
  }
}
