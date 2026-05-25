import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HeroSection } from '../components/sections/HeroSection'
import { LocationSection } from '../components/sections/LocationSection'
import { OrderOptionsSection } from '../components/sections/OrderOptionsSection'
import { PopularDishesSection } from '../components/sections/PopularDishesSection'

export function HomePage() {
  const location = useLocation()

  useEffect(() => {
    const raw = location.hash?.replace(/^#/, '')
    if (!raw) {
      return
    }
    const id = decodeURIComponent(raw)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.pathname, location.hash])

  return (
    <>
      <HeroSection />
      <PopularDishesSection />
      <OrderOptionsSection />
      <LocationSection />
    </>
  )
}
