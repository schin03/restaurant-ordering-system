import { Box, Flex, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'

/** Chakra primitives with Framer Motion; `forwardMotionProps` keeps animation props off the DOM when possible. */
export const MotionBox = motion.create(Box, { forwardMotionProps: true })
export const MotionFlex = motion.create(Flex, { forwardMotionProps: true })
export const MotionVStack = motion.create(VStack, { forwardMotionProps: true })
