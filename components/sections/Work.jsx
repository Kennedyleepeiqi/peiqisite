'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { id: 1, title: 'Aurelia', category: 'Rebranding', year: '2025', tint: 'from-[#e9e4ff] to-[#cdd6ff]' },
  { id: 2, title: 'Nord & Co.', category: 'Visual Identity', year: '2025', tint: 'from-[#f3efe6] to-[#e7dcc9]' },
  { id: 3, title: 'Halcyon', category: 'Web / WebGL', year: '2024', tint: 'from-[#dff5ef] to-[#c4eadf]' },
  { id: 4, title: 'Monolith', category: 'Campaign', year: '2024', tint: 'from-[#ececec] to-[#d7d7d7]' },
  { id: 5, title: 'Lumen', category: 'Interactive Media', year: '2024', tint: 'from-[#ffe9f0] to-[#ffd0e0]' },
]

export default function Work() {
  const section = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        const el = track.current
        const distance = el.scrollWidth - window.innerWidth + 64
        const tween = gsap.to(el, {
          x: -distance,
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        return () => tween.kill()
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="work"
      ref={section}
      className="relative overflow-hidden bg-canvas py-28 sm:py-0"
    >
      <div className="container-lux flex items-end justify-between pt-4 sm:pt-28">
        <div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted">03</span>
            <span className="eyebrow">Selected Works</span>
          </div>
          <h2 className="mt-6 font-serif text-[clamp(1.9rem,4.5vw,3.4rem)] font-light leading-[1.1] tracking-tight text-ink">
            A curated archive.
          </h2>
        </div>
        <span className="hidden text-xs uppercase tracking-[0.2em] text-muted sm:block">
          Drag / Scroll →
        </span>
      </div>

      <div className="mt-14 sm:flex sm:min-h-[100svh] sm:items-center">
        <div
          ref={track}
          className="flex gap-6 overflow-x-auto px-6 pb-6 sm:overflow-visible sm:px-16 sm:pb-0"
        >
          {projects.map((p) => (
            <article
              key={p.id}
              data-cursor="Open"
              className="group relative h-[62vh] w-[80vw] shrink-0 overflow-hidden rounded-3xl border border-line sm:h-[68vh] sm:w-[46vw] lg:w-[38vw]"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${p.tint} transition-transform duration-[1.2s] ease-lux group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

              <div className="relative flex h-full flex-col justify-between p-8">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-white/60 px-4 py-1.5 text-xs backdrop-blur">
                    {p.category}
                  </span>
                  <span className="font-mono text-xs text-ink/60">{p.year}</span>
                </div>

                <div className="translate-y-2 transition-transform duration-700 ease-lux group-hover:translate-y-0">
                  <div className="flex items-end justify-between">
                    <h3 className="font-serif text-4xl font-light text-ink sm:text-6xl">
                      {p.title}
                    </h3>
                    <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canvas opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-4 max-h-0 overflow-hidden text-sm text-ink/70 transition-all duration-700 ease-lux group-hover:max-h-24">
                    A confident identity rollout balancing restraint and impact —
                    crafted end-to-end from concept to launch.
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Tail CTA card */}
          <a
            href="#contact"
            data-cursor="Let's talk"
            className="group flex h-[62vh] w-[80vw] shrink-0 flex-col items-center justify-center rounded-3xl border border-dashed border-ink/30 sm:h-[68vh] sm:w-[36vw] lg:w-[28vw]"
          >
            <span className="font-serif text-3xl font-light italic text-ink transition-transform duration-500 group-hover:-translate-y-1">
              Your project next?
            </span>
            <span className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">
              Start an enquiry
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
