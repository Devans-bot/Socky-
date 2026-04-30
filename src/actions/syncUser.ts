'use server'

import { adminClient } from '../sanity/adminClient';

export async function syncUserToSanity(user: {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}) {
  if (!user.id || !user.email) return { success: false, error: 'Missing user data' };

  try {
    // Check if user already exists
    const existingUser = await adminClient.fetch(
      `*[_type == "customer" && clerkUserId == $id][0]`,
      { id: user.id }
    );

    if (existingUser) {
      return { success: true, message: 'User already exists' };
    }

    // Create new customer if not found
    await adminClient.create({
      _type: 'customer',
      _id: `customer-${user.id}`,
      email: user.email,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      clerkUserId: user.id,
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: 'User synced successfully' };
  } catch (error) {
    console.error('Sync Error:', error);
    return { success: false, error: 'Failed to sync user' };
  }
}
