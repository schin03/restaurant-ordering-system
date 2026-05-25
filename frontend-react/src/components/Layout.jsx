import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  Box,
  CloseButton,
  Container,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Text,
} from '@chakra-ui/react'
import { MdPhone } from 'react-icons/md'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MotionBox } from '../lib/chakra-motion'
import { EASE_OUT } from '../lib/motion-presets'
import { NavLinks } from './NavLinks'
import { SiteFooter } from './SiteFooter'

const PHONE_DISPLAY = '(604) 277-6666'
const PHONE_HREF = 'tel:+16042776666'

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = () => setDrawerOpen(false)
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogoClick = (e) => {
    closeDrawer()
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return
    }
    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'instant' })
    if (location.pathname === '/') {
      e.preventDefault()
      if (location.hash) {
        navigate('/', { replace: true })
      }
      scrollTop()
      return
    }
    e.preventDefault()
    navigate('/')
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollTop)
    })
  }

  return (
    <Box minH="100dvh" display="flex" flexDirection="column" bg="bg">
      <MotionBox
        as="header"
        position="sticky"
        top={0}
        zIndex="sticky"
        borderBottomWidth="1px"
        borderColor="border"
        bg="bg/95"
        backdropFilter="blur(8px)"
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.42, ease: EASE_OUT }}
      >
        <Box px={4}>
          <Container maxW="7xl" py={{ base: 1, md: 3 }}>
            <Flex align="center" justify="space-between" gap={4} minW={0}>
              <Box
                as={RouterLink}
                to="/"
                onClick={handleLogoClick}
                display="flex"
                alignItems="center"
                gap={{ base: 2, md: 3 }}
                flex={{ base: '1', md: 'none' }}
                minW={{ base: 0, md: 'unset' }}
                fontWeight="bold"
                color="green.800"
                letterSpacing="tight"
                minH="44px"
                css={{
                  '@media (max-width: 767px)': {
                    containerType: 'inline-size',
                  },
                }}
                _hover={{ opacity: 0.9 }}
              >
                <Image
                  src="/bamboo-logo.png"
                  alt="Bamboo Express Ltd. — Oriental take out"
                  h={{ base: '38px', md: '44px' }}
                  w={{ base: '38px', md: '44px' }}
                  fit="contain"
                  flexShrink={0}
                  draggable={false}
                  loading="eager"
                />
                <Text
                  as="span"
                  whiteSpace="nowrap"
                  minW={{ base: 0, md: 'unset' }}
                  lineHeight="shorter"
                  css={{
                    fontSize: '1.125rem',
                    '@media (max-width: 767px)': {
                      fontSize: 'clamp(0.75rem, 0.5rem + 5cqi, 1.125rem)',
                    },
                  }}
                >
                  Bamboo Express
                </Text>
              </Box>

              <HStack gap={{ base: 2, md: 3 }} align="center" flexShrink={0}>
                <HStack gap={1} display={{ base: 'none', md: 'flex' }}>
                  <NavLinks />
                </HStack>

                <Link
                  href={PHONE_HREF}
                  display={{ base: 'none', md: 'inline-flex' }}
                  alignItems="center"
                  gap={1.5}
                  fontWeight="semibold"
                  fontSize="md"
                  color="green.800"
                  textDecoration="none"
                  px={2}
                  py={2}
                  borderRadius="md"
                  minH="44px"
                  _hover={{ color: 'green.700', bg: 'bg.muted', textDecoration: 'none' }}
                  aria-label={`Call Bamboo Express at ${PHONE_DISPLAY}`}
                >
                  <Box as="span" lineHeight={0} flexShrink={0} aria-hidden>
                    <MdPhone size={20} />
                  </Box>
                  {PHONE_DISPLAY}
                </Link>

                <DrawerRoot open={drawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)}>
                  <DrawerTrigger asChild display={{ base: 'inline-flex', md: 'none' }}>
                    <IconButton
                      aria-label="Open navigation menu"
                      variant="ghost"
                      size="md"
                      minW="44px"
                      minH="44px"
                      colorPalette="green"
                    >
                      <MenuIcon />
                    </IconButton>
                  </DrawerTrigger>
                  <DrawerBackdrop />
                  <DrawerPositioner>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Navigate</DrawerTitle>
                        <DrawerCloseTrigger asChild position="absolute" top="3" insetEnd="3">
                          <CloseButton
                            size="md"
                            aria-label="Close navigation"
                            variant="ghost"
                            colorPalette="green"
                          />
                        </DrawerCloseTrigger>
                      </DrawerHeader>
                      <DrawerBody pt={2}>
                        <NavLinks onNavigate={closeDrawer} direction="column" />
                      </DrawerBody>
                    </DrawerContent>
                  </DrawerPositioner>
                </DrawerRoot>
              </HStack>
            </Flex>
          </Container>
        </Box>
      </MotionBox>

      <Box as="main" flex="1">
        <Outlet />
      </Box>

      <SiteFooter />

      <Box
        display={{
          base: drawerOpen ? 'none' : 'block',
          md: 'none',
        }}
        position="fixed"
        zIndex={20}
        bottom="calc(1rem + env(safe-area-inset-bottom, 0px))"
        right="calc(1rem + env(safe-area-inset-right, 0px))"
      >
        <Link
          href={PHONE_HREF}
          display="inline-flex"
          alignItems="center"
          gap={2}
          bg="green.700"
          color="white"
          px={4}
          py={3}
          borderRadius="full"
          fontWeight="semibold"
          fontSize="sm"
          textDecoration="none"
          boxShadow="lg"
          minH="48px"
          _hover={{ bg: 'green.800', color: 'white' }}
          _active={{ bg: 'green.900' }}
          aria-label={`Call Bamboo Express at ${PHONE_DISPLAY}`}
        >
          <Box as="span" lineHeight={0} flexShrink={0} aria-hidden>
            <MdPhone size={22} />
          </Box>
          {PHONE_DISPLAY}
        </Link>
      </Box>
    </Box>
  )
}

function MenuIcon() {
  return (
    <Box as="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" boxSize="1.35rem">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </Box>
  )
}
