import type { ReactNode } from 'react';
import { Box, Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import { usePermissions } from '@/api/permissions';
import { NoAccess } from './NoAccess';

/**
 * Blocks the dashboard when the user holds no permission on it at all.
 *
 * Sits OUTSIDE the page component on purpose. The dashboard runs hundreds of
 * hooks, so it cannot return early itself without breaking the rules of hooks —
 * the check has to happen before that component mounts.
 *
 * Partial access is not this component's job: someone granted two of four tabs
 * still gets the dashboard, with the tab strip doing the filtering.
 */
export function PermissionGate({
  children,
  dashboardName,
}: {
  children: ReactNode;
  dashboardName: string;
}) {
  const { isReady, hasAnyInResource, isError } = usePermissions();

  // Fail closed. If permissions cannot be read we do not know what this user
  // may see, and guessing "everything" is the wrong way to be wrong.
  if (isError) {
    return <NoAccess dashboardName={dashboardName} portalUrl={portalUrl()} />;
  }

  if (!isReady) {
    return (
      <Flex minH="70vh" align="center" justify="center">
        <VStack gap={4}>
          <Spinner size="xl" />
          <Text fontSize="lg" color="gray.500">
            Checking your access…
          </Text>
        </VStack>
      </Flex>
    );
  }

  if (!hasAnyInResource) {
    return (
      <Box>
        <NoAccess dashboardName={dashboardName} portalUrl={portalUrl()} />
      </Box>
    );
  }

  return <>{children}</>;
}

function portalUrl(): string | undefined {
  const portal = import.meta.env.VITE_AUTH_PORTAL_URL;
  return portal ? `${String(portal).replace(/\/+$/, '')}/dashboard` : undefined;
}
