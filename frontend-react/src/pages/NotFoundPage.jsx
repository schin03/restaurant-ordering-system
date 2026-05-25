import { useEffect, useLayoutEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { Box, Button, Container, Flex, Heading, Image, Text, VStack } from '@chakra-ui/react'
import { MotionBox } from '../lib/chakra-motion'
import { EASE_OUT } from '../lib/motion-presets'

export function NotFoundPage() {
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    const previous = document.title
    document.title = 'Page not found — Bamboo Express'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <MotionBox
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_OUT }}
      py={{ base: 16, md: 24 }}
      px={4}
    >
      <Container maxW="7xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          justify={{ base: 'flex-start', md: 'center' }}
          gap={{ base: 8, md: 10, lg: 14 }}
        >
          <VStack align="start" gap={{ base: 6, md: 8 }} maxW="lg" flex="1" minW={0}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="green.700"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              404
            </Text>
            <Heading as="h1" size={{ base: 'xl', md: '2xl' }} color="fg">
              This page could not be found
            </Heading>
            <Text color="fg.muted" fontSize="lg">
              The link may be broken, or the page may have been removed. You can return home or open our menu.
            </Text>
            <Box display="flex" flexWrap="wrap" gap={3} pt={2}>
              <Button
                asChild
                size="lg"
                minH="48px"
                fontWeight="semibold"
                bg="green.700"
                color="white"
                _hover={{ bg: 'green.800' }}
                _active={{ bg: 'green.900' }}
              >
                <Box as={RouterLink} to="/" display="inline-flex" alignItems="center">
                  Go to home
                </Box>
              </Button>
              <Button
                asChild
                size="lg"
                minH="48px"
                fontWeight="semibold"
                variant="outline"
                borderColor="green.700"
                color="green.800"
                _hover={{ bg: 'green.50', borderColor: 'green.800' }}
              >
                <Box as={RouterLink} to="/menu" display="inline-flex" alignItems="center">
                  View menu
                </Box>
              </Button>
            </Box>
          </VStack>
          <Box
            flexShrink={0}
            w={{ base: 'full', md: 'auto' }}
            maxW={{ base: 'md', md: 'min(38vw, 500px)' }}
            mx={{ base: 'auto', md: 0 }}
          >
            <Image
              src="/panda404gif.gif"
              alt="Cartoon giant panda lying face-down on the grass, looking tired and lost"
              w="full"
              h="auto"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="border"
              boxShadow="md"
              draggable={false}
              loading="eager"
            />
          </Box>
        </Flex>
      </Container>
    </MotionBox>
  )
}
