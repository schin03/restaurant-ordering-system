import { useLayoutEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { MenuSection } from '../components/sections/MenuSection'
import { MotionBox } from '../lib/chakra-motion'
import { EASE_OUT } from '../lib/motion-presets'
import {useLocation} from "react-router-dom";

export function MenuPage() {
  const reduceMotion = useReducedMotion()
  const location = useLocation();
  useLayoutEffect(() => {
    const targetId = decodeURIComponent(
      window.location.hash.substring(1)
    );
  
    if (!targetId) return;
  
    let timeoutId;
    let attempts = 0;
  
    function scrollToMenuItem() {
      const element = document.getElementById(targetId);
  
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
  
        element.classList.add("menu-item-highlight");
  
        timeoutId = window.setTimeout(() => {
          element.classList.remove("menu-item-highlight");
        }, 1800);
  
        return;
      }
  
      if (attempts < 60) {
        attempts += 1;
        window.requestAnimationFrame(scrollToMenuItem);
      }
    }
  
    // Let MenuSection and MenuItemCard finish mounting first.
    timeoutId = window.setTimeout(scrollToMenuItem, 0);
  
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.hash]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <MotionBox
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_OUT }}
    >
      <MenuSection hideChinese />
    </MotionBox>
  )
}
