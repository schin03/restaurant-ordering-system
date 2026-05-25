import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useReducedMotion } from 'framer-motion'
import { GiChopsticks } from 'react-icons/gi'
import { Link as RouterLink } from 'react-router-dom'
import { POPULAR_DISHES } from '../../data/menuItems'
import { MotionBox } from '../../lib/chakra-motion'
import { EASE_OUT, revealViewport } from '../../lib/motion-presets'

function PopularDishCard({ num, en, zh, price, menuSectionId, imageSrc, imageAlt }) {
  const reduceMotion = useReducedMotion()
  const revealTransition = { duration: reduceMotion ? 0 : 0.48, ease: EASE_OUT }
  const cardVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: revealTransition },
  }

  return (
    <MotionBox
      bg="bg"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border"
      overflow="hidden"
      h="full"
      display="flex"
      flexDirection="column"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.22, ease: EASE_OUT } }}
    >
      <Box position="relative" aspectRatio="4/3" w="full" bg="bg.muted">
        <Image
          src={imageSrc}
          alt={imageAlt}
          position="absolute"
          inset={0}
          w="full"
          h="full"
          objectFit="cover"
          loading="lazy"
        />
      </Box>
      <VStack align="stretch" gap={2} p={{ base: 4, md: 4 }} flex="1">
        <Flex align="center" justify="space-between" gap={2} flexWrap="wrap">
          {num ? (
            <Badge colorPalette="green" variant="subtle" fontSize="xs" px={2} py={0.5} borderRadius="md">
              #{num}
            </Badge>
          ) : null}
          <Text fontWeight="bold" fontSize="sm" color="green.800" ml="auto">
            {price}
          </Text>
        </Flex>
        <Box>
          <Text fontWeight="semibold" fontSize="md" lineHeight="snug">
            {en}
          </Text>
          <Text color="fg.muted" fontSize="sm" mt={1} lineHeight="tall" lang="zh-Hant">
            {zh}
          </Text>
        </Box>
        <Box mt="auto" pt={1}>
          <Box
            as={RouterLink}
            to={`/menu#${menuSectionId}`}
            fontSize="sm"
            fontWeight="medium"
            color="green.700"
            textDecoration="underline"
          >
            View On Menu
          </Box>
        </Box>
      </VStack>
    </MotionBox>
  )
}

export function PopularDishesSection() {
  const reduceMotion = useReducedMotion()
  const revealTransition = { duration: reduceMotion ? 0 : 0.5, ease: EASE_OUT }
  const headerVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: revealTransition },
  }

  return (
    <Box as="section" id="popular-dishes" scrollMarginTop="5rem" py={{ base: 12, md: 16 }} px={4} bg="bg">
      <Container maxW="7xl">
        <VStack align="stretch" gap={{ base: 6, md: 8 }}>
          <MotionBox
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'stretch', md: 'flex-end' }}
              justify="space-between"
              gap={4}
            >
            <Box>
              <Heading as="h2" size="2xl" fontWeight="bold">
                Popular dishes
              </Heading>
              <Text color="fg.muted" fontSize="md" maxW="3xl" lineHeight="tall" mt={3}>
                A few customer favourites from our menu.
              </Text>
            </Box>
            <Button
              asChild
              size="lg"
              minH="48px"
              fontWeight="semibold"
              bg="green.700"
              color="white"
              _hover={{ bg: 'green.600' }}
              alignSelf={{ base: 'stretch', md: 'center' }}
            >
              <Box
                as={RouterLink}
                to="/menu"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
              >
                <Box as="span" lineHeight={0} flexShrink={0} aria-hidden>
                  <GiChopsticks size={22} />
                </Box>
                View menu
              </Box>
            </Button>
            </Flex>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 4, md: 5 }}>
            {POPULAR_DISHES.map((dish) => (
              <PopularDishCard key={`${dish.menuSectionId}-${dish.num}`} {...dish} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}
