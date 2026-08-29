import type { ReactNode } from 'react';
import { Box, Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import { usePermissions } from '@/api/permissions';
import { joinPortalPath } from '@/utils/session';
import { NoAccess } from './NoAccess';

/**
 * Blocks the dashboard when the user holds no permission on it at all.
 */
export function PermissionGate({
  children,
  dashboardName,
}: {
  children: ReactNode;
  dashboardName: string;
}) {
  const { isReady, hasAnyInResource, isError } = usePermissions();

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
  if (!import.meta.env.VITE_AUTH_PORTAL_URL) return undefined;
  return joinPortalPath('dashboard');
}
