import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { Button } from '@/components/button';
import { useNavigate } from 'react-router-dom';
import { useColorMode } from '@/theme/color-mode';
import { FaHome } from 'react-icons/fa';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  return (
    <Box
      minH="100vh"
      bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="container.md" textAlign="center">
        <VStack gap={8}>
          <Text fontSize="9xl" fontWeight="bold" color="brand.500">
            404
          </Text>
          <Heading
            size="2xl"
            color={colorMode === 'light' ? 'gray.800' : 'gray.100'}
          >
            Page Not Found
          </Heading>
          <Text fontSize="lg" color="gray.500" maxW="md">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </Text>
          <Button
            colorPalette="brand"
            size="lg"
            onClick={() => navigate('/')}
            gap={2}
          >
            <FaHome />
            Go Back Home
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
