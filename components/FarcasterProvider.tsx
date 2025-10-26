'use client';

import { useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Farcaster SDK when component mounts
    const initFarcaster = async () => {
      try {
        // Check if running inside Farcaster
        const context = await sdk.context;

        if (context) {
          console.log('[Farcaster] Running inside Farcaster Mini App');
          console.log('[Farcaster] Context:', context);

          // Signal that the app is ready
          sdk.actions.ready();
          console.log('[Farcaster] SDK ready signal sent');
        } else {
          console.log('[Farcaster] Running outside Farcaster (normal web browser)');
        }
      } catch (error) {
        console.log('[Farcaster] Not running in Farcaster environment:', error);
        // Silently fail - app works normally outside Farcaster
      }
    };

    initFarcaster();
  }, []);

  return <>{children}</>;
}
