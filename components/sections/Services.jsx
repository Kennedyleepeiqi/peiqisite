'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'

const services = [
  {
    id: 'rebrand',
    title: 'Complete Company Rebranding',
    desc: 'Repositioning established brands for a more professional, luxury presence — from strategy and naming to a cohesive identity system that commands premium perception.',
    tags: ['Positioning', 'Naming', 'Guidelines'],
  },
  {
    id: 'identity',
    title: 'Visual Identity',
    desc: 'Logos, document headers, envelope design, corporate booklets and email signatures — every touchpoint crafted into one immaculate, consistent language.',
    tags: ['Logo Systems', 'Stationery', 'Collateral'],
  },
  {
    id: 'web',
    title: 'Web Design & Interactive Media',
    desc: 'High-fidelity websites and interactive experiences built with motion, 3D and creative code — the kind of digital presence that feels alive and unforgettable.',
    tags: ['Web', 'WebGL', 'Motion'],
  },
  {
    id: 'campaign',
    title: 'Campaign Design',
    desc: 'Art-directed campaigns that carry a brand across channels with a singular, striking aesthetic — from key visuals to full rollout.',
    tags: ['Art Direction', 'Key Visuals', 'Rollout'],
  },
]

export default function Services() {
  const [active, setActive] = useState('rebrand')

  return (
    <section id="services" className="relative bg-ink py-28 text-canvas sm:py-40">
      <div className="container-lux">
        <div className="[&_.eyebrow]:text-canvas/50 [&_span.font-mono]:text-canvas/40 [&_.border-line]:border-white/15">
          <SectionHeading index="02" label="Services" />
        </div>

        <Reveal>
          <h2 className="mt-14 max-w-3xl font-serif text-[clamp(1.9rem,4.5vw,3.4rem)] font-light leading-[1.1] tracking-tight">
            A focused suite of work, engineered to make brands look{' '}
            <span className="italic text-white">extraordinary</span>.
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-white/15">
          {services.map((s, i) => {
            const open = active === s.id
            return (
              <div
                key={s.id}
                onMouseEnter={() => setActive(s.id)}
                className="group cursor-pointer border-b border-white/15"
                data-cursor=""
              >
                <div className="flex items-center gap-6 py-8">
                  <span className="font-mono text-xs text-canvas/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className={`flex-1 font-serif text-2xl font-light transition-all duration-500 ease-lux sm:text-4xl ${
                      open ? 'text-white translate-x-2' : 'text-canvas/55'
                    }`}
                  >
                    {s.title}
                  </h3>
                  <Plus
                    className={`h-5 w-5 shrink-0 transition-transform duration-500 ease-lux ${
                      open ? 'rotate-45 text-white' : 'rotate-0 text-canvas/40'
                    }`}
                  />
                </div>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-6 pb-10 pl-10 md:grid-cols-12">
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
      </div>
    </section>
  )
}
