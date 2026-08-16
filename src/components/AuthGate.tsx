import { useEffect, useState, type ReactNode } from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import {
  hasValidSession,
  redeemTicketFromUrl,
  redirectToPortal,
} from '@/utils/session';
import { startUsageTracking } from '@/utils/usage';

type GateState = 'checking' | 'allowed' | 'redirecting';

/**
 * Blocks the whole app until there is a valid portal session.
 *
 * Nothing below this renders — and so no API call fires — until either an
 * existing session is confirmed or a handoff ticket has been redeemed for one.
 * A signed-out visitor never sees dashboard chrome flash by on the way out.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>('checking');

  useEffect(() => {
    let cancelled = false;

    const settle = async () => {
      // A ticket in the URL always wins: arriving with one means the portal
      // just handed over a fresh session, which should replace whatever this
      // tab was holding. A no-op when there is no ticket.
      await redeemTicketFromUrl();
      if (cancelled) return;

      // Checked after redeeming rather than trusting its result — the portal
      // could have handed over a token that is itself already expired.
      if (hasValidSession()) {
        setState('allowed');
        return;
      }

      setState('redirecting');
      redirectToPortal();
    };

    void settle();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state !== 'allowed') return;

    // Only starts once there is a real session, so time is never attributed to
    // a visitor who is about to be bounced to the portal.
    const stopUsageTracking = startUsageTracking();

    // The token can expire while the tab sits open. Re-check when the user
    // comes back to it, so a stale tab bounces instead of firing 401s.
    const recheck = () => {
      if (!hasValidSession()) redirectToPortal();
    };

    const interval = window.setInterval(recheck, 60_000);
    document.addEventListener('visibilitychange', recheck);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', recheck);
      stopUsageTracking();
    };
  }, [state]);

  if (state !== 'allowed') {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={4}>
          <Spinner size="xl" />
          <Text fontSize="lg" color="gray.500">
            {state === 'redirecting' ? 'Redirecting to sign in…' : 'Signing you in…'}
          </Text>
        </VStack>
      </Box>
    );
  }

  return <>{children}</>;
}
