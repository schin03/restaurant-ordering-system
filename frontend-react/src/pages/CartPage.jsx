import { useLayoutEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { CartSection }  from '../components/sections/CartSection'
import { MotionBox } from '../lib/chakra-motion'
import { EASE_OUT } from '../lib/motion-presets'

export function CartPage() {
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <MotionBox
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_OUT }}
    >
      <CartSection hideChinese />
    </MotionBox>
  )
}