'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import ActionButton from '@/components/ui/ActionButton'
import { services, tracks } from '@/content/site'

const process = [
  {
    step: '01',
    title: 'Position',
    desc: 'Audit where you stand, define who you are for and decide what the brand has to make people believe.',
  },
  {
    step: '02',
    title: 'Design',
    desc: 'Build the identity, the UX/UI and every asset it lives on — print, digital and social — as one coherent system.',
  },
  {
    step: '03',
    title: 'Launch & sell',
    desc: 'Roll it out across the touchpoints that carry revenue, then refine against what the market actually responds to.',
  },
]

export default function Services() {
  const [active, setActive] = useState(services[0].id)

  return (
    <section id="services" className="relative bg-ink py-28 text-canvas sm:py-40">
      <div className="container-lux">
        <div className="[&_.eyebrow]:text-canvas/50 [&_span.font-mono]:text-canvas/40 [&_.border-line]:border-white/15">
          <SectionHeading index="02" label="Services" />
        </div>

        <Reveal>
          <h2 className="mt-14 max-w-4xl font-serif text-[clamp(1.9rem,4.5vw,3.4rem)] font-light leading-[1.1] tracking-tight">
            Everything a business needs to be taken seriously — and{' '}
            <span className="italic text-white">everything it needs to sell</span>.
          </h2>
        </Reveal>

        {/* Three routes in, so a shipping company and a solo consultant both
            find themselves within the first screen of this section. */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
          {tracks.map((t, i) => (
            <Reveal
              key={t.id}
              delay={i * 0.1}
              className="group bg-ink p-8 transition-colors duration-500 hover:bg-white/[0.04] sm:p-10"
            >
              <span className="eyebrow !text-canvas/45">{t.label}</span>
              <h3 className="mt-5 font-serif text-2xl font-light text-white sm:text-3xl">
                {t.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-canvas/65">
                {t.desc}
              </p>
              <ul className="mt-7 border-t border-white/10">
                {t.points.map((p) => (
                  <li
                    key={p}
                    className="border-b border-white/10 py-2.5 text-[0.82rem] text-canvas/70"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24 flex items-baseline gap-4">
          <span className="font-mono text-xs text-canvas/40">↳</span>
          <span className="eyebrow !text-canvas/50">Capabilities</span>
        </Reveal>

        <div className="mt-8 border-t border-white/15">
          {services.map((s, i) => {
            const open = active === s.id
            return (
              <div key={s.id} className="border-b border-white/15">
                {/* A real button, so the row opens on tap and by keyboard as
                    well as on hover. Hover alone left most of the services
                    unreachable on touch devices. */}
                <button
                  type="button"
                  onClick={() => setActive(s.id)}
                  onMouseEnter={() => setActive(s.id)}
                  aria-expanded={open}
                  aria-controls={`service-${s.id}`}
                  className="group flex w-full cursor-pointer items-center gap-6 py-7 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-canvas/40 focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
                >
                  <span className="font-mono text-xs text-canvas/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className={`flex-1 font-serif text-2xl font-light transition-all duration-500 ease-lux sm:text-4xl ${
                      open
                        ? 'translate-x-2 text-white'
                        : 'text-canvas/55 group-hover:text-canvas/80'
                    }`}
                  >
                    {s.title}
                  </h3>
                  <Plus
                    className={`h-5 w-5 shrink-0 transition-transform duration-500 ease-lux ${
                      open ? 'rotate-45 text-white' : 'rotate-0 text-canvas/40'
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`service-${s.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-6 pb-10 md:grid-cols-12 md:pl-10">
                        <p className="text-sm leading-relaxed text-canvas/70 md:col-span-7">
                          {s.desc}
                        </p>
                        <div className="flex flex-wrap items-start gap-2 md:col-span-5 md:justify-end">
                          {s.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-canvas/70"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* The part that separates this from a design menu: the work is run as
            a commercial process, not a list of files to deliver. */}
        <div className="mt-28 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {process.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.1}>
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-canvas/40">{p.step}</span>
                <h4 className="font-serif text-xl font-light text-white sm:text-2xl">
                  {p.title}
                </h4>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-canvas/60">
                {p.desc}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-20">
          <ActionButton
            as="a"
            href="#contact"
            variant="light"
            icon
            data-cursor="Say hi"
            className="px-7 py-4 text-sm font-medium"
          >
            Discuss your brand
          </ActionButton>
        </Reveal>
      </div>
    </section>
  )
}
