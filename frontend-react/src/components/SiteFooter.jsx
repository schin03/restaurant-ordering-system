import { Box, Container, Flex, Grid, HStack, IconButton, Image, Text } from '@chakra-ui/react'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NavLinks } from './NavLinks'

export function SiteFooter() {
  const location = useLocation()
  const navigate = useNavigate()

  const goHomeTop = (e) => {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return
    }
    e.preventDefault()
    const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (location.pathname === '/') {
      if (location.hash) {
        navigate('/', { replace: true })
      }
      scrollTop()
      return
    }
    navigate('/')
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollTop)
    })
  }

  return (
    <Box as="footer" borderTopWidth="1px" borderColor="border" py={{ base: 8, md: 10 }} px={4} mt="auto" bg="bg.subtle">
      <Container maxW="7xl">
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr auto 1fr' }}
          alignItems="center"
          justifyItems={{ base: 'center', lg: 'stretch' }}
          gap={{ base: 6, lg: 8 }}
        >
          <Link to="/" onClick={goHomeTop} style={{ textDecoration: 'none' }}>
            <Flex
              as="span"
              display="inline-flex"
              alignItems="center"
              gap={3}
              flexShrink={0}
              fontWeight="bold"
              fontSize="lg"
              color="green.800"
              letterSpacing="tight"
              minH="44px"
              cursor="pointer"
              _hover={{ opacity: 0.9 }}
              justifySelf={{ base: 'center', lg: 'start' }}
            >
              <Image
                src="/bamboo-logo.png"
                alt="Bamboo Express Ltd. — Oriental take out"
                h="44px"
                w="44px"
                fit="contain"
                flexShrink={0}
                draggable={false}
                loading="lazy"
              />
              <Text as="span">Bamboo Express</Text>
            </Flex>
          </Link>

          <Flex justify="center" minW={0} w="full">
            <NavLinks flexWrap="wrap" justifyContent="center" />
          </Flex>

          <HStack gap={1} flexShrink={0} justifySelf={{ base: 'center', lg: 'end' }}>
            <IconButton
              asChild
              variant="ghost"
              size="md"
              minW="44px"
              minH="44px"
              colorPalette="green"
              aria-label="Bamboo Express on Instagram"
            >
              <a href="https://www.instagram.com/bamboo.express/" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={22} />
              </a>
            </IconButton>
            <IconButton
              asChild
              variant="ghost"
              size="md"
              minW="44px"
              minH="44px"
              colorPalette="green"
              aria-label="Bamboo Express on Facebook"
            >
              <a href="https://www.facebook.com/BambooXpress" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={22} />
              </a>
            </IconButton>
          </HStack>
        </Grid>

        <Text
          fontSize="sm"
          color="fg.muted"
          textAlign="left"
          mt={{ base: 6, md: 6 }}
          pt={{ base: 6, md: 0 }}
          borderTopWidth={{ base: '1px', md: 0 }}
          borderColor="border"
        >
          © {new Date().getFullYear()} Bamboo Express · Richmond, BC
        </Text>
      </Container>
    </Box>
  )
}
