import { Badge, Box, Button, Container, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { useReducedMotion } from 'framer-motion'
import { FaCar } from 'react-icons/fa'
import { MdPhone } from 'react-icons/md'
import { GrGroup } from 'react-icons/gr'
import { MdOutlineTakeoutDining } from 'react-icons/md'
import { MotionBox } from '../../lib/chakra-motion'
import { EASE_OUT, revealViewport } from '../../lib/motion-presets'

function BulletList({ items }) {
  return (
    <VStack as="ul" align="stretch" gap={2.5} listStyleType="none" m={0} p={0}>
      {items.map((content, i) => (
        <Flex key={i} as="li" align="flex-start" gap={2.5}>
          <Text as="span" color="green.700" fontWeight="bold" lineHeight="tall" flexShrink={0} mt={0.5}>
            •
          </Text>
          <Text color="fg" lineHeight="tall">
            {content}
          </Text>
        </Flex>
      ))}
    </VStack>
  )
}

function OptionCard({ title, icon, prominentBadge, badges, children, itemVariants }) {
  const reduceMotion = useReducedMotion()

  return (
    <MotionBox
      bg="bg"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border"
      borderLeftWidth="4px"
      borderLeftColor="green.700"
      boxShadow="sm"
      p={{ base: 5, md: 6 }}
      h="full"
      variants={itemVariants}
      whileHover={reduceMotion ? undefined : { y: -2, transition: { duration: 0.2, ease: EASE_OUT } }}
    >
      <Flex align="center" gap={3} mb={3}>
        <Box color="green.700" flexShrink={0} lineHeight={0} aria-hidden>
          {icon}
        </Box>
        <Heading as="h3" size="lg" fontWeight="bold">
          {title}
        </Heading>
      </Flex>
      {prominentBadge ? (
        <Badge
          colorPalette="green"
          variant="surface"
          size="md"
          px={2.5}
          py={1}
          borderRadius="md"
          fontWeight="semibold"
          fontSize="sm"
          mb={3}
          w="fit-content"
          cursor="default"
        >
          {prominentBadge}
        </Badge>
      ) : null}
      {badges?.length ? (
        <Flex flexWrap="wrap" gap={2} mb={4}>
          {badges.map((label) => (
            <Badge
              key={label}
              colorPalette="green"
              variant="subtle"
              fontSize="xs"
              px={2}
              py={0.5}
              borderRadius="md"
              fontWeight="semibold"
              cursor="default"
            >
              {label}
            </Badge>
          ))}
        </Flex>
      ) : null}
      {children}
    </MotionBox>
  )
}

export function OrderOptionsSection() {
  const reduceMotion = useReducedMotion()
  const revealTransition = { duration: reduceMotion ? 0 : 0.5, ease: EASE_OUT }
  const cardRevealTransition = { duration: reduceMotion ? 0 : 0.45, ease: EASE_OUT }
  const stagger = reduceMotion ? 0 : 0.13

  const introVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: revealTransition },
  }

  const cardsContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: reduceMotion ? 0 : 0.04 },
    },
  }

  const cardItemVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 14, x: -14 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: cardRevealTransition,
    },
  }

  return (
    <Box as="section" id="order-options" scrollMarginTop="5rem" py={{ base: 12, md: 16 }} px={4} bg="bg.subtle">
      <Container maxW="7xl">
        <VStack align="stretch" gap={{ base: 8, md: 10 }}>
          <MotionBox
            variants={introVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <VStack align="stretch" gap={3}>
              <Heading as="h2" size="2xl" fontWeight="bold">
                Order Options
              </Heading>
              <Text color="fg.muted" fontSize="md" maxW="3xl" lineHeight="tall">
                Delivery, take-out, and large orders. Choose what works for you.
              </Text>
            </VStack>
          </MotionBox>

          <MotionBox
            display="grid"
            gridTemplateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }}
            gap={{ base: 5, lg: 6 }}
            alignItems="stretch"
            variants={cardsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <OptionCard
              itemVariants={cardItemVariants}
              title="Delivery"
              icon={<FaCar size={26} />}
              prominentBadge="Free delivery · within 5 km"
              badges={['$30 min order', 'From 4:30 p.m.']}
            >
             
              <BulletList
                items={[
                  'Available daily from 4:30 p.m. on orders over $30.00 before tax.',
                  'Last call for delivery: 8:20 p.m.',
                  'We accept cash, debit, and credit.',
                ]}
              />
            </OptionCard>

            <OptionCard
              itemVariants={cardItemVariants}
              title="Take-out"
              icon={<MdOutlineTakeoutDining size={28} />}
              badges={['10% off', '$30 min order']}
            >
              <BulletList
                items={[
  
                  '10% off your bill when you order take-out*.',
                  'Last call for take-out: 8:45 p.m.',
                ]}
              />
              <Text fontSize="sm" color="fg.muted" mt={4} lineHeight="tall">
                * Discount applies to orders over $30.00 before tax.
              </Text>
            </OptionCard>

            <OptionCard itemVariants={cardItemVariants} title="Catering" icon={<GrGroup size={26} />}>
              <BulletList
                items={[
                  'Hosting a party, office lunch, or family dinner? We can handle catering orders.',
                  'Call ahead with your head count and pickup time—we can help with portions and timing.',
                  'Advance notice helps us prepare everything fresh and on schedule.',
                ]}
              />
            </OptionCard>
          </MotionBox>

          <MotionBox
            variants={introVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
          <Flex justify="center" pt={{ base: 2, md: 4 }}>
            <Button
              asChild
              variant="outline"
              colorPalette="green"
              size="lg"
              minH="48px"
              fontWeight="semibold"
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
          </Flex>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  )
}
