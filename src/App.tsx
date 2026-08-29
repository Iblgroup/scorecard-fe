import { Suspense, lazy } from 'react';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ErrorPage from '@/pages/ErrorPage';

const ScorecardDashboard = lazy(() => import('@/pages/ScorecardDashboard'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function LoadingFallback() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={4}>
        <Spinner size="xl" colorPalette="brand" />
        <Text fontSize="lg" color="gray.500">
          Loading...
        </Text>
      </VStack>
    </Box>
  );
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ScorecardDashboard />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: '*',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <NotFoundPage />
        </Suspense>
      ),
    },
  ],
  { basename: '/scorecard-dashboard' },
);

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
