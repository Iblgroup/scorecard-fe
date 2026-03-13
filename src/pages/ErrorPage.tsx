import { Box, Container, Heading, Text, VStack, Code } from '@chakra-ui/react'
import { Button } from '@/components/button'
import { useNavigate, useRouteError } from 'react-router-dom'
import { useColorMode } from '@/theme/color-mode'
import { FaHome, FaExclamationTriangle } from 'react-icons/fa'

export default function ErrorPage() {
    const navigate = useNavigate()
    const { colorMode } = useColorMode()
    const error = useRouteError() as { statusText?: string; message?: string }

    return (
        <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'} display="flex" alignItems="center" justifyContent="center">
            <Container maxW="container.md" textAlign="center">
                <VStack gap={8}>
                    <Box fontSize="8xl" color="red.500">
                        <FaExclamationTriangle />
                    </Box>
                    <Heading size="2xl" color={colorMode === 'light' ? 'gray.800' : 'gray.100'}>
                        Something Went Wrong
                    </Heading>
                    <Text fontSize="lg" color="gray.500" maxW="md">
                        An unexpected error has occurred. We apologize for the inconvenience.
                    </Text>
                    {error && (
                        <Box
                            p={4}
                            bg={colorMode === 'light' ? 'red.50' : 'red.900/20'}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor="red.200"
                            maxW="lg"
                            w="full"
                        >
                            <Code colorPalette="red" fontSize="sm">
                                {error.statusText || error.message || 'Unknown error'}
                            </Code>
                        </Box>
                    )}
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
    )
}
