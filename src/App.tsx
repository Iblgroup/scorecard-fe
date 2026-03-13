import { Suspense, lazy } from 'react';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ErrorPage from '@/pages/ErrorPage';

// Lazy load pages for better performance
const ScorecardDashboard = lazy(() => import('@/pages/ScorecardDashboard'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Loading fallback component
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

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/scorecard-dashboard" replace />,
  },
  {
    path: '/scorecard-dashboard',
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
]);

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
