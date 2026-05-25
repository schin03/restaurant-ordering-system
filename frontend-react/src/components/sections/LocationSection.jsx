import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Separator,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useReducedMotion } from 'framer-motion'
import { GiChopsticks } from 'react-icons/gi'
import { MdLocationOn, MdPhone } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { MotionBox } from '../../lib/chakra-motion'
import { EASE_OUT, revealViewport } from '../../lib/motion-presets'

const ADDRESS = '8180 No 2 Rd #178, Richmond, BC V7C 5K1'
const PHONE_DISPLAY = '(604) 277-6666'
const PHONE_TEL = '+16042776666'

const mapsSearchUrl =
  'https://www.google.com/maps/search/?api=1&query=8180+No+2+Rd+%23178,+Richmond,+BC+V7C+5K1'

/** Google Maps embed (search). Replace with your “Share → Embed” iframe if you prefer. */
const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=16&ie=UTF8&iwloc=&output=embed`

const hoursRows = [
  { day: 'Monday', closed: true },
  { day: 'Tuesday', range: '11:00 a.m. – 9:00 p.m.' },
  { day: 'Wednesday', range: '11:00 a.m. – 9:00 p.m.' },
  { day: 'Thursday', range: '11:00 a.m. – 9:00 p.m.' },
  { day: 'Friday', range: '11:00 a.m. – 9:00 p.m.' },
  { day: 'Saturday', range: '11:00 a.m. – 9:00 p.m.' },
  { day: 'Sunday', range: '4:00 p.m. – 9:00 p.m.' },
]

export function LocationSection() {
  const reduceMotion = useReducedMotion()
  const revealTransition = { duration: reduceMotion ? 0 : 0.5, ease: EASE_OUT }
  const blockVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: revealTransition },
  }

  return (
    <Box as="section" id="location" scrollMarginTop="5rem" py={{ base: 12, md: 16 }} px={4} bg="bg">
      <Container maxW="7xl">
        <VStack align="stretch" gap={{ base: 8, md: 10 }}>
          <MotionBox
            variants={blockVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <VStack align="stretch" gap={4}>
              <Heading as="h2" size="2xl" fontWeight="bold">
                Location & Hours
              </Heading>

              <VStack align="stretch" gap={4}>
                <Flex align="flex-start" gap={3}>
                  <Box color="green.700" mt={0.5} flexShrink={0} lineHeight={0}>
                    <MdLocationOn size={22} aria-hidden />
                  </Box>
                  <Link
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="green.700"
                    fontWeight="medium"
                    textDecoration="underline"
                    lineHeight="tall"
                  >
                    {ADDRESS}
                  </Link>
                </Flex>
                <Flex align="center" gap={3}>
                  <Box color="green.700" flexShrink={0} lineHeight={0}>
                    <MdPhone size={20} aria-hidden />
                  </Box>
                  <Link href={`tel:${PHONE_TEL}`} color="green.700" fontWeight="medium" textDecoration="underline">
                    {PHONE_DISPLAY}
                  </Link>
                </Flex>
              </VStack>
            </VStack>
          </MotionBox>

          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={{ base: 8, lg: 10 }}
            align={{ lg: 'stretch' }}
          >
            {/* Map */}
            <MotionBox
              flex={{ lg: '1' }}
              minW={0}
              minH={{ lg: 0 }}
              borderRadius="lg"
              overflow="hidden"
              borderWidth="1px"
              borderColor="border"
              boxShadow="sm"
              bg="bg"
              h={{ base: '280px', sm: '340px', lg: 'auto' }}
              alignSelf={{ lg: 'stretch' }}
              variants={blockVariants}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
            >
              <Box
                as="iframe"
                title="Bamboo Express on Google Maps"
                src={mapsEmbedUrl}
                w="100%"
                h="100%"
                border={0}
                display="block"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </MotionBox>

            {/* Details */}
            <VStack align="stretch" flex={{ lg: '1' }} gap={6} minW={0}>
              <MotionBox
                bg="bg"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="border"
                boxShadow="sm"
                p={{ base: 5, md: 6 }}
                variants={blockVariants}
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
              >
                <Text fontWeight="bold" fontSize="lg" mb={4} textAlign="center" color="fg">
                  Our Hours
                </Text>
                <VStack align="stretch" gap={0} separator={<Separator />}>
                  {hoursRows.map((row) => (
                    <Flex key={row.day} py={3} justify="space-between" align="center" gap={4} wrap="wrap">
                      <Text fontWeight="medium" color="fg">
                        {row.day}
                      </Text>
                      {row.closed ? (
                        <Badge colorPalette="red" variant="subtle" size="md" px={2.5} py={0.5} borderRadius="full">
                          Closed
                        </Badge>
                      ) : (
                        <Text color="fg.muted" fontSize="sm" textAlign="right">
                          {row.range}
                        </Text>
                      )}
                    </Flex>
                  ))}
                </VStack>
              </MotionBox>

              <MotionBox
                variants={blockVariants}
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
              >
              <Flex direction={{ base: 'column', sm: 'row' }} gap={3} w="full">
                <Button
                  asChild
                  size="lg"
                  minH="48px"
                  flex={{ sm: 1 }}
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
                    View menu
                  </Box>
                </Button>
                <Button
                  asChild
                  size="lg"
                  minH="48px"
                  flex={{ sm: 1 }}
                  fontWeight="semibold"
                  bg="white"
                  color="green.800"
                  borderWidth="1px"
                  borderColor="gray.200"
                  _hover={{ bg: 'gray.100' }}
                >
                  <Box
                    as="a"
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Box as="span" lineHeight={0} flexShrink={0} aria-hidden>
                      <MdLocationOn size={22} />
                    </Box>
                    Get directions
                  </Box>
                </Button>
              </Flex>
              </MotionBox>
            </VStack>
          </Flex>
        </VStack>
      </Container>
    </Box>
  )
}
