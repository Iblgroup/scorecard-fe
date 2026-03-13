import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  IconButton,
} from '@chakra-ui/react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Table } from '@/components/table';
import { useColorMode } from '@/theme/color-mode';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from '@/features/counter/counterSlice';
import { FaMoon, FaSun } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';

export default function HomePage() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const { colorMode, toggleColorMode } = useColorMode();

  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Sample table data
  const tableData = [
    { id: 1, name: 'John Doe', role: 'Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Designer', status: 'Active' },
    { id: 3, name: 'Bob Johnson', role: 'Manager', status: 'Inactive' },
    { id: 4, name: 'Alice Williams', role: 'Developer', status: 'Active' },
  ];

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Container maxW="container.md" py={20}>
        <VStack gap={8}>
          {/* Header */}
          <HStack w="full" justify="space-between">
            <Heading
              size="2xl"
              bgGradient="to-r"
              gradientFrom="brand.400"
              gradientTo="primary.500"
              backgroundClip="text"
            >
              React + Vite + Chakra + Redux
            </Heading>
            <IconButton
              aria-label="Toggle color mode"
              onClick={toggleColorMode}
              colorPalette="brand"
              variant="ghost"
            >
              {colorMode === 'light' ? <FaMoon /> : <FaSun />}
            </IconButton>
          </HStack>

          {/* Counter Card */}
          <Box
            w="full"
            p={8}
            borderRadius="xl"
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            boxShadow="2xl"
          >
            <VStack gap={6}>
              <HStack gap={2}>
                <FiUsers size={20} />
                <Text fontWeight="medium" fontSize="lg">
                  Redux Counter Example
                </Text>
              </HStack>

              <Text fontSize="6xl" fontWeight="bold" color="brand.500">
                {count}
              </Text>

              <HStack gap={4}>
                <Button
                  colorPalette="red"
                  onClick={() => dispatch(decrement())}
                  size="lg"
                >
                  Decrement
                </Button>
                <Button
                  colorPalette="brand"
                  onClick={() => dispatch(increment())}
                  size="lg"
                >
                  Increment
                </Button>
              </HStack>

              <HStack gap={4}>
                <Button
                  colorPalette="primary"
                  variant="secondary"
                  onClick={() => dispatch(incrementByAmount(5))}
                >
                  Add 5
                </Button>
                <Button
                  colorPalette="secondary"
                  variant="secondary"
                  onClick={() => dispatch(incrementByAmount(10))}
                >
                  Add 10
                </Button>
                <Button
                  colorPalette="accent"
                  variant="secondary"
                  onClick={() => dispatch(reset())}
                >
                  Reset
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Divider */}
          <Box
            w="full"
            h="1px"
            bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          />

          {/* Input Components Section */}
          <Box
            w="full"
            p={8}
            borderRadius="xl"
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            boxShadow="2xl"
          >
            <VStack gap={6} align="stretch">
              <HStack gap={2}>
                <FiUsers size={20} />
                <Text fontWeight="medium" fontSize="lg">
                  Themed Input Components
                </Text>
              </HStack>

              <Input
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <HStack gap={4}>
                <Button
                  colorPalette="primary"
                  onClick={() => alert(`Name: ${name}, Email: ${email}`)}
                >
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setName('');
                    setEmail('');
                  }}
                >
                  Clear
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Button Variants Section */}
          <Box
            w="full"
            h="1px"
            bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          />
          <Box
            w="full"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            _dark={{ borderColor: 'gray.700' }}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
          >
            <VStack gap={6} align="stretch">
              <HStack gap={2}>
                <FiUsers size={20} />
                <Text fontWeight="medium" fontSize="lg">
                  Button Variants
                </Text>
              </HStack>
              <Text
                fontWeight="medium"
                color="gray.600"
                _dark={{ color: 'gray.400' }}
              >
                Solid Buttons
              </Text>
              <HStack gap={3} flexWrap="wrap">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="gray">Gray</Button>
                <Button variant="black">Black</Button>
              </HStack>
              <Text
                fontWeight="medium"
                color="gray.600"
                _dark={{ color: 'gray.400' }}
              >
                Outline Buttons
              </Text>
              <HStack gap={3} flexWrap="wrap">
                <Button variant="primaryOutline">Primary Outline</Button>
                <Button variant="secondaryOutline">Secondary Outline</Button>
              </HStack>
              <Text
                fontWeight="medium"
                color="gray.600"
                _dark={{ color: 'gray.400' }}
              >
                Status Buttons
              </Text>
              <HStack gap={3} flexWrap="wrap">
                <Button variant="success">Success</Button>
                <Button variant="error">Error</Button>
                <Button variant="warning">Warning</Button>
              </HStack>
            </VStack>
          </Box>

          {/* Divider */}
          <Box
            w="full"
            h="1px"
            bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          />

          {/* Table Component Section */}
          <Box
            w="full"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            _dark={{ borderColor: 'gray.700' }}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
          >
            <Table data={tableData} title="Team Members" />
          </Box>

          {/* Info Section */}
          <VStack gap={3} mt={8}>
            <Text fontSize="sm" color="gray.500">
              ✅ Vite 6 for blazing fast development
            </Text>
            <Text fontSize="sm" color="gray.500">
              ✅ Chakra UI v3 for beautiful components
            </Text>
            <Text fontSize="sm" color="gray.500">
              ✅ Redux Toolkit for state management
            </Text>
            <Text fontSize="sm" color="gray.500">
              ✅ TypeScript 5.7 for type safety
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
