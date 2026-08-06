'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import ActionButton from '@/components/ui/ActionButton'
import useOnScreen from '@/lib/useOnScreen'
import { positioning } from '@/content/site'

// The WebGL scene is client-only and lazy-loaded so it never blocks first paint.
const HeroScene = dynamic(() => import('@/components/hero/HeroScene'), {
  ssr: false,
})

const ease = [0.16, 1, 0.3, 1]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const line = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1, ease } },
}

// Accent line uses a fade-up instead of a clip mask. Italic Fraunces runs past
// its line box on every axis (ascenders, descenders like g/y, and the slant on
// the right), and overflow-hidden was slicing those strokes — especially where
// the next line's mask stacked on top.
const lineAccent = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
}

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
}

// Clip masks only on lines without hanging italic descenders.
const clip = 'block overflow-hidden pt-[0.14em] pb-[0.22em] -mt-[0.14em] -mb-[0.22em]'

export default function Hero() {
  const [first, accent, last] = positioning.headline
  const { ref: sceneHost, visible } = useOnScreen()

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Interactive 3D backdrop. This layer accepts pointer events so the
          object can be touched directly; the overlays above it opt out. */}
      <div ref={sceneHost} className="absolute inset-0 z-0">
        <HeroScene active={visible} />
      </div>

      {/* Soft left-to-right wash keeps the headline crisp while letting the
          glass object breathe in the right-hand negative space. */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-canvas via-canvas/60 to-transparent" />

      <div className="pointer-events-none container-lux relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="pointer-events-auto max-w-4xl"
        >
          <motion.p variants={fade} className="eyebrow mb-8">
            {positioning.eyebrow}
          </motion.p>

          <h1 className="font-serif text-[clamp(2.75rem,9vw,7.5rem)] font-light leading-[1.08] tracking-tightest text-ink">
            <span className={clip}>
              <motion.span variants={line} className="block">
                {first}
              </motion.span>
            </span>
            <span className="relative z-[1] block pb-[0.1em]">
              <motion.span
                variants={lineAccent}
                className="text-sheen-metal italic"
              >
                {accent}
              </motion.span>
            </span>
            <span className={`${clip} relative z-0`}>
              <motion.span variants={line} className="block">
                {last}
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fade}
            className="mt-10 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {positioning.intro}
          </motion.p>

          <motion.div
            variants={fade}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <ActionButton
              as="a"
              href="#work"
              icon
              data-cursor="View"
              className="px-7 py-4 text-sm font-medium"
            >
              View selected work
            </ActionButton>

            <ActionButton
              as="a"
              href="#contact"
              variant="outline"
              data-cursor="Say hi"
              className="px-7 py-4 text-sm font-medium"
            >
              Start a project
            </ActionButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="container-lux pointer-events-none absolute bottom-8 left-0 right-0 z-10 flex items-center justify-end text-[0.7rem] uppercase tracking-[0.28em] text-muted"
      >
        <span>Based in Singapore</span>
      </motion.div>
    </section>
  )
}
