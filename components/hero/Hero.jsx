'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'

const HeroScene = dynamic(() => import('@/components/hero/HeroScene'), {
  ssr: false,
})

const ease = [0.16, 1, 0.3, 1]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const line = { hidden: { y: '115%' }, show: { y: '0%', transition: { duration: 1.05, ease } } }
const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 z-0 grid-lines opacity-70" />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <HeroScene />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-canvas via-canvas/50 to-transparent" />

      <div className="container-lux relative z-10">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl">
          <motion.div variants={fade} className="mb-8 flex items-center gap-3">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <p className="eyebrow">Interactive Media · Digital Arts · Brand Identity</p>
          </motion.div>

          <h1 className="font-serif text-[clamp(2.75rem,9vw,7.5rem)] font-light leading-[0.92] tracking-tightest text-ink">
            <span className="block overflow-hidden">
              <motion.span variants={line} className="block">
                Designing
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={line} className="block italic holo-text animate-shimmer">
                luxury
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={line} className="block">
                into every pixel.
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fade}
            className="mt-10 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            I&apos;m Peiqi — a creator engineering brand identities through refined visual
            systems and immersive, high-fidelity digital experiences.
          </motion.p>

          <motion.div variants={fade} className="mt-12 flex flex-wrap items-center gap-4">
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
              className="rounded-full border border-line bg-surface/60 px-7 py-4 text-sm font-medium text-ink backdrop-blur transition-colors duration-500 hover:border-ink"
            >
              Start a project
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="container-lux absolute bottom-8 left-0 right-0 z-10 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.28em] text-muted"
      >
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-px animate-pulse bg-muted" />
          Scroll to explore
        </span>
        <span>Est. 2026 — Everywhere</span>
      </motion.div>
    </section>
  )
}
