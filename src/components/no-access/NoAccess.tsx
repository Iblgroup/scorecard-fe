import { Box, Flex, Link, Text, VStack } from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';

/**
 * Shown when the signed-in user holds no permission anywhere in this dashboard.
 *
 * Deliberately not an error screen: nothing has gone wrong, they simply have not
 * been granted this one. So it names the dashboard, says who to ask, and offers
 * the way back to the portal — rather than a red triangle implying a fault.
 */
export function NoAccess({
  dashboardName,
  portalUrl,
}: {
  dashboardName: string;
  portalUrl?: string;
}) {
  return (
    <Flex minH="70vh" align="center" justify="center" px={6}>
      <VStack
        gap={5}
        maxW="440px"
        textAlign="center"
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="0 2px 16px rgba(26,61,143,0.08)"
        px={10}
        py={12}
      >
        <Flex
          w="72px"
          h="72px"
          borderRadius="full"
          bg="rgba(26,61,143,0.08)"
          align="center"
          justify="center"
          color="#1a3d8f"
          fontSize="30px"
        >
          <FiLock />
        </Flex>

        <Box>
          <Text fontSize="20px" fontWeight="800" color="#1a3d8f" mb={2}>
            You don&apos;t have access
          </Text>
          <Text fontSize="14px" color="gray.600" lineHeight="1.7">
            Your account has not been given permission to view{' '}
            <Text as="span" fontWeight="700" color="gray.700">
              {dashboardName}
            </Text>
            . If you think this is a mistake, ask your administrator to grant you
            a role that includes it.
          </Text>
        </Box>

        {portalUrl && (
          <Link
            href={portalUrl}
            bg="#1a3d8f"
            color="white"
            px={6}
            py={3}
            borderRadius="lg"
            fontSize="14px"
            fontWeight="700"
            _hover={{ bg: '#1e4aa0', textDecoration: 'none' }}
          >
            Back to dashboards
          </Link>
        )}
      </VStack>
    </Flex>
  );
}
