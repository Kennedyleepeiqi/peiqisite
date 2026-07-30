'use client'

import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal, { RevealWords } from '@/components/ui/Reveal'
import Marquee from '@/components/ui/Marquee'
import { about, deliverables, positioning } from '@/content/site'

export default function About() {
  return (
    <section id="about" className="relative bg-canvas py-28 sm:py-40">
      <div className="container-lux">
        <SectionHeading index="01" label="Approach" />

        <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* Claim, then counter-claim. Two beats on separate lines with a
                rule drawn between them, rather than one long sentence. */}
            <h2 className="font-serif text-[clamp(2.1rem,5vw,4.1rem)] font-light leading-[1.02] tracking-tightest text-ink">
              <span className="block">
                <RevealWords text={about.statement} />
              </span>

              <motion.span
                aria-hidden="true"
                className="my-7 block h-px w-full max-w-sm origin-left bg-[linear-gradient(90deg,rgba(17,19,23,0.4),rgba(17,19,23,0))] sm:my-9"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              />

              <span className="block text-muted">
                <RevealWords
                  text={about.statementMuted}
                  accentFrom={-1}
                  accentClassName="text-sheen-metal italic"
                  delay={0.6}
                />
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pt-3">
            <Reveal delay={0.15}>
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`text-sm leading-relaxed text-muted ${i ? 'mt-6' : ''}`}
                >
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
        </div>

        {/* The motto, given its own air so it reads as the thesis of the page
            rather than another paragraph. */}
        <Reveal className="mt-24 border-y border-line py-14 text-center sm:mt-28 sm:py-20">
          <p className="font-serif text-[clamp(1.6rem,4vw,3rem)] font-light leading-[1.15] tracking-tight text-ink">
            {positioning.motto.split('. ').map((half, i) => (
              <span key={i} className={i ? 'italic text-muted' : ''}>
                {i ? ' ' : ''}
                {half.endsWith('.') ? half : `${half}.`}
              </span>
            ))}
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {about.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-surface p-8">
              <div className="font-serif text-4xl font-light text-ink sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.15em] text-muted">
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Breadth strip — the full deliverable list, read in one pass. */}
      <Marquee
        items={deliverables}
        className="mt-24 border-y border-line py-6"
        itemClassName="font-serif text-2xl font-light italic text-ink/80 sm:text-3xl"
      />
    </section>
  )
}
