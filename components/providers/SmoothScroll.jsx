'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext(null)

/**
 * Anything that needs to move the page — the nav dock, anchor links — must go
 * through this instance. A second scroll engine (or a raw window.scrollTo)
 * would fight Lenis for the scroll position and stutter.
 */
export function useLenis() {
  return useContext(LenisContext)
}

/**
 * Buttery inertia scrolling via Lenis, kept in perfect sync with GSAP's
 * ScrollTrigger so cinematic scroll animations stay frame-accurate.
 */
export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    instance.on('scroll', ScrollTrigger.update)

    const raf = (time) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    setLenis(instance)

    // Let anchor links defer to Lenis for smooth in-page navigation.
    const handleAnchor = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')
      if (id && id.length > 1) {
        const el = document.querySelector(id)
        if (el) {
          e.preventDefault()
          instance.scrollTo(el, { offset: 0 })
        }
      }
    }
    document.addEventListener('click', handleAnchor)

    return () => {
      document.removeEventListener('click', handleAnchor)
      gsap.ticker.remove(raf)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
