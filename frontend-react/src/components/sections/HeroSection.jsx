import { Box, Button, Container, Image } from '@chakra-ui/react'
import { useReducedMotion } from 'framer-motion'
import { GiChopsticks } from 'react-icons/gi'
import { MdPhone } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { MotionBox, MotionFlex, MotionVStack } from '../../lib/chakra-motion'
import { EASE_OUT } from '../../lib/motion-presets'

export function HeroSection() {
  const reduceMotion = useReducedMotion()
  const revealTransition = { duration: reduceMotion ? 0 : 0.55, ease: EASE_OUT }
  const stagger = reduceMotion ? 0 : 0.09

  const rowVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: stagger * 0.65 },
    },
  }

  const innerColumnVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: 0 },
    },
  }

  const itemVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: revealTransition,
    },
  }

  return (
    <Box
      as="section"
      id="main"
      position="relative"
      overflow="hidden"
      scrollMarginTop="5rem"
      color="white"
      minH={{ base: '420px', md: 'min(80vh, 700px)' }}
      display="flex"
      alignItems="center"
      py={{ base: 16, md: 20 }}
      px={4}
    >
      <Box
        position="absolute"
        inset={0}
        aria-hidden
        css={{
          backgroundImage: 'url(/hero-ss-pork.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      />
      <Box
        position="absolute"
        inset={0}
        css={{
          background:
            'linear-gradient(105deg, rgba(10, 42, 26, 0.94) 0%, rgba(10, 42, 26, 0.78) 38%, rgba(14, 65, 42, 0.5) 62%, rgba(12, 55, 48, 0.35) 100%)',
        }}
        aria-hidden
      />
      <Container maxW="7xl" position="relative" zIndex={1} w="full">
        <MotionFlex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
          gap={{ base: 8, md: 10, lg: 12 }}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
        >
          <MotionVStack align="start" gap={5} flex="1" minW={0} variants={innerColumnVariants}>
            <MotionBox
              as="h1"
              variants={itemVariants}
              fontSize={{ base: '2.25rem', md: '3.25rem', lg: '3.75rem' }}
              fontWeight="bold"
              textShadow="0 2px 24px rgba(0,0,0,0.35)"
            >
              Bamboo Express
            </MotionBox>
            <MotionBox
              as="p"
              variants={itemVariants}
              fontSize={{ base: 'lg', md: 'xl' }}
              opacity={0.95}
              maxW="2xl"
              textShadow="0 1px 12px rgba(0,0,0,0.3)"
            >
              We serve delicious Chinese cuisine in Richmond. Conveniently located in Blundell Centre. Take-out or
              delivery.
            </MotionBox>
            <MotionFlex
              direction={{ base: 'column', sm: 'row' }}
              gap={3}
              w={{ base: 'full', sm: 'auto' }}
              flexWrap="wrap"
              variants={itemVariants}
            >
              <Button
                asChild
                size="lg"
                minH="48px"
                fontWeight="semibold"
                bg="green.700"
                color="white"
                _hover={{ bg: 'green.600' }}
              >
                <Box
                  as={RouterLink}
                  to="/menu"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                >
                  <Box as="span" lineHeight={0} flexShrink={0} aria-hidden>
                    <GiChopsticks size={22} />
                  </Box>
                  View Menu
                </Box>
              </Button>
              <Button
                asChild
                size="lg"
                minH="48px"
                fontWeight="semibold"
                variant="outline"
                borderColor="whiteAlpha.800"
                color="white"
                _hover={{ bg: 'whiteAlpha.200', borderColor: 'white' }}
              >
                <Box
                  as="a"
                  href="tel:+16042776666"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  aria-label="Call Bamboo Express at (604) 277-6666"
                >
                  <Box as="span" lineHeight={0} flexShrink={0} aria-hidden>
                    <MdPhone size={22} />
                  </Box>
                  Call now
                </Box>
              </Button>
            </MotionFlex>
          </MotionVStack>
          <MotionBox
            flexShrink={0}
            alignSelf={{ base: 'center', md: 'flex-start' }}
            bg="white"
            p={{ base: 0, md: 2, lg: 3 }}
            borderRadius="full"
            overflow="hidden"
            boxShadow="0 8px 28px rgba(0,0,0,0.35)"
            variants={itemVariants}
          >
            <Image
              src="/bamboo-logo.png"
              alt="Bamboo Express Ltd. — Oriental take out"
              h={{ base: '192px', sm: '240px', md: '304px', lg: '380px' }}
              w={{ base: '192px', sm: '240px', md: '304px', lg: '380px' }}
              fit="contain"
              draggable={false}
              display="block"
              loading="eager"
            />
          </MotionBox>
        </MotionFlex>
      </Container>
    </Box>
  )
}
