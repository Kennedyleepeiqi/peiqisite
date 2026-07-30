'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useLenis } from '@/components/providers/SmoothScroll'

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

// Diameters in px, one per state a dot can occupy. Width and height always move
// together, so a dot stays a dot — it only grows. Every value here, and the slot
// below, is even on purpose: the dot is centred with a -50% translate, so an odd
// size would park it on a half pixel and the gradient would rasterise soft.
// Crispness at this scale is most of the finish.
const SIZE = { dot: 10, neighbour: 14, active: 16, focus: 22 }

const SLOT = 34 // fixed cell each pill morphs inside, so nothing ever reflows
const GAP = 8

// The pills hold their axis — no sideways drift toward the cursor. Proximity is
// expressed purely through the vertical morph and a slight gathering of the
// spacing toward the cursor.
const REACH = 200 // how far left of the deck the field is felt
const SPREAD = 84 // vertical falloff of that field
const PULL_Y = 7

const GLIDE = 1.4 // seconds, matched to the brief's 1400ms power2.out

// Desynchronised shimmer timings. Hard-coded rather than randomised so the
// server and client markup agree, but spaced on irregular intervals so the
// deck never reads as five lights pulsing in unison.
const SHIMMER = [
  { duration: 5.2, delay: 0 },
  { duration: 6.8, delay: 1.9 },
  { duration: 4.6, delay: 3.4 },
  { duration: 7.3, delay: 0.8 },
  { duration: 5.9, delay: 2.7 },
]

/**
 * Fixed liquid-chrome section deck.
 *
 * Every dot sits absolutely centred inside a fixed-size slot, so morphing its
 * height never reflows the column — the sequence spacing stays exact while the
 * metal stretches. GSAP owns width/height/x/y; globals.css owns the surface.
 */
export default function NavDock() {
  const slots = useRef([])
  const dots = useRef([])
  const magnets = useRef([])
  const centres = useRef([])

  const focused = useRef(-1)
  const engaged = useRef(false)
  const activeIndex = useRef(0)
  const reduced = useRef(false)

  const [active, setActive] = useState(0)
  const [focus, setFocus] = useState(-1)
  const lenis = useLenis()

  const sizeFor = useCallback((i) => {
    const f = focused.current
    if (f === -1) return i === activeIndex.current ? SIZE.active : SIZE.dot
    if (i === f) return SIZE.focus
    if (Math.abs(i - f) === 1) return SIZE.neighbour
    return i === activeIndex.current ? SIZE.active : SIZE.dot
  }, [])

  /* Growing springs, shrinking settles. Elastic on the way back down reads as
     wobble rather than weight. */
  const morph = useCallback(
    (i) => {
      const el = dots.current[i]
      if (!el) return

      const size = sizeFor(i)
      const grow = size > gsap.getProperty(el, 'height')

      gsap.to(el, {
        height: size,
        width: size,
        duration: reduced.current ? 0 : grow ? 0.9 : 0.5,
        ease: grow ? 'elastic.out(1, 0.52)' : 'power3.out',
        overwrite: 'auto',
      })
    },
    [sizeFor],
  )

  const morphAll = useCallback(() => {
    SECTIONS.forEach((_, i) => morph(i))
  }, [morph])

  const measure = useCallback(() => {
    centres.current = slots.current.filter(Boolean).map((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    })
  }, [])

  const release = useCallback(() => {
    if (!engaged.current && focused.current === -1) return
    engaged.current = false
    magnets.current.forEach((m) => m.y(0))
    if (focused.current !== -1) {
      focused.current = -1
      setFocus(-1)
      morphAll()
    }
  }, [morphAll])

  /* Set up the deck: centre every dot on its slot, then build the quickTo
     setters that carry the magnetic offsets. */
  useEffect(() => {
    reduced.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    gsap.set(dots.current, {
      xPercent: -50,
      yPercent: -50,
      height: SIZE.dot,
      width: SIZE.dot,
      x: 0,
      y: 0,
    })

    magnets.current = dots.current.map((el) => ({
      y: gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' }),
    }))

    measure()
    morphAll()

    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [measure, morphAll])

  /* Magnetic field. Distance from the cursor sets both how far each dot drifts
     and which one blooms into the tall capsule. */
  useEffect(() => {
    if (reduced.current) return

    const onMove = (e) => {
      const cs = centres.current
      if (cs.length !== SECTIONS.length) return

      const gap = cs[0].x - e.clientX // positive while the cursor is left of the deck
      const inBand =
        gap < REACH &&
        gap > -90 &&
        e.clientY > cs[0].y - 130 &&
        e.clientY < cs[cs.length - 1].y + 130

      if (!inBand) return release()

      engaged.current = true
      const strength = 1 - gsap.utils.clamp(0, REACH, Math.max(gap, 0)) / REACH

      let nearest = 0
      let shortest = Infinity

      cs.forEach((c, i) => {
        const d = Math.abs(e.clientY - c.y)
        if (d < shortest) {
          shortest = d
          nearest = i
        }

        const falloff = Math.exp(-(d * d) / (2 * SPREAD * SPREAD))
        const dy = e.clientY - c.y

        magnets.current[i].y(
          gsap.utils.clamp(-1, 1, dy / (SPREAD * 1.4)) *
            PULL_Y *
            strength *
            falloff,
        )
      })

      if (nearest !== focused.current) {
        focused.current = nearest
        setFocus(nearest)
        morphAll()
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('blur', release)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', release)
    }
  }, [morphAll, release])

  /* Active tracking. The negative margins collapse the observer root to a thin
     band across the middle of the viewport, so "active" means "the section
     currently crossing the centre line" — no snapping, no thresholds to tune.
     When nothing intersects (the footer, say) the last section stays lit. */
  useEffect(() => {
    const targets = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      Boolean,
    )
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const i = SECTIONS.findIndex((s) => s.id === entry.target.id)
          if (i !== -1) setActive(i)
        })
      },
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    activeIndex.current = active
    morphAll()
  }, [active, morphAll])

  const go = (i) => {
    const el = document.getElementById(SECTIONS[i].id)
    if (!el) return

    // Press in, then spring back — a uniform scale so the dot never deforms
    // into an oval on the way.
    const dot = dots.current[i]
    if (dot && !reduced.current) {
      gsap.fromTo(
        dot,
        { scale: 0.7 },
        { scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.45)' },
      )
    }

    // Lead the highlight so the deck answers the click instantly; the observer
    // takes over and confirms it as the glide lands.
    setActive(i)

    // Resolve the target in document coordinates rather than handing Lenis the
    // element: Work is pinned by ScrollTrigger, and its pin-spacer throws off
    // the offsetTop chain Lenis would otherwise walk, landing ~60px short.
    const top = window.scrollY + el.getBoundingClientRect().top

    if (lenis) {
      lenis.scrollTo(top, {
        immediate: reduced.current,
        duration: GLIDE,
        easing: gsap.parseEase('power2.out'),
      })
    } else {
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <nav
      aria-label="Section navigation"
      style={{ gap: GAP }}
      className="fixed right-10 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center lg:flex"
    >
      <span aria-hidden="true" className="dock-plate" />

      {SECTIONS.map((section, i) => (
        <button
          key={section.id}
          ref={(el) => (slots.current[i] = el)}
          type="button"
          onClick={() => go(i)}
          onFocus={() => {
            focused.current = i
            setFocus(i)
            morphAll()
          }}
          onBlur={release}
          aria-label={section.label}
          aria-current={active === i ? 'true' : undefined}
          style={{ height: SLOT, width: SLOT }}
          className="relative flex items-center justify-center focus:outline-none"
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-ink/[0.06] bg-white/80 px-3 py-[5px] text-[0.5rem] uppercase leading-none tracking-[0.22em] text-ink/80 shadow-[0_6px_16px_-10px_rgba(17,19,23,0.45)] backdrop-blur-md transition-[opacity,transform] duration-500 ease-lux ${
              focus === i
                ? 'translate-x-0 opacity-100'
                : 'translate-x-1.5 opacity-0'
            }`}
          >
            {section.label}
          </span>

          <span
            ref={(el) => (dots.current[i] = el)}
            className="dock-dot absolute left-1/2 top-1/2"
            style={{
              '--shimmer-duration': `${SHIMMER[i].duration}s`,
              '--shimmer-delay': `${SHIMMER[i].delay}s`,
            }}
          />
        </button>
      ))}
    </nav>
  )
}
