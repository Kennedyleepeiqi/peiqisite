'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'

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

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Interactive 3D backdrop. This layer accepts pointer events so the
          object can be touched directly; the overlays above it opt out. */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
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
            Interactive Media · Digital Arts · Brand Identity
          </motion.p>

          <h1 className="font-serif text-[clamp(2.75rem,9vw,7.5rem)] font-light leading-[0.95] tracking-tightest text-ink">
            <span className="block overflow-hidden">
              <motion.span variants={line} className="block">
                Designing
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                variants={line}
                className="text-sheen-purple block w-fit pr-[0.08em] italic"
              >
                luxury
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={line} className="block">
                into every detail.
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fade}
            className="mt-10 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            I&apos;m Peiqi — a creator elevating brand identities through
            refined visual systems and immersive, interactive experiences.
          </motion.p>

          <motion.div
            variants={fade}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              as="a"
              href="#work"
              data-cursor="View"
              className="group gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-canvas"
            >
              View selected work
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-lux group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>

            <MagneticButton
              as="a"
              href="#contact"
              data-cursor="Say hi"
              className="rounded-full border border-line px-7 py-4 text-sm font-medium text-ink transition-colors duration-500 hover:border-ink"
            >
              Start a project
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="container-lux pointer-events-none absolute bottom-8 left-0 right-0 z-10 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.28em] text-muted"
      >
        <span>Scroll</span>
        <span>Based in — Everywhere</span>
      </motion.div>
    </section>
  )
}
