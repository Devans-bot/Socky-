'use client'

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { syncUserToSanity } from '../actions/syncUser';

export default function SyncUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !hasSynced.current) {
      const email = user.emailAddresses[0]?.emailAddress;
      
      if (email) {
        syncUserToSanity({
          id: user.id,
          email: email,
          firstName: user.firstName,
          lastName: user.lastName,
        }).then((res) => {
          if (res.success) {
            hasSynced.current = true;
          }
        });
      }
    }
  }, [isLoaded, isSignedIn, user]);

  return null; // This component doesn't render anything
}
