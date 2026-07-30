'use client'

import { useState } from 'react'
import Reveal from '@/components/ui/Reveal'
import CardStage from '@/components/ui/CardStage'
import { redesign } from '@/content/site'

export default function Redesign() {
  const [active, setActive] = useState(redesign.variants[1].key)
  const variant =
    redesign.variants.find((v) => v.key === active) ?? redesign.variants[0]

  // No top padding: the divider inside picks up from the Work section's own
  // bottom margin, so this reads as part of the same case rather than a new one.
  return (
    <section id="redesign" className="relative bg-canvas pb-28 sm:pb-40">
      <div className="container-lux">
        <div className="grid grid-cols-1 gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <span className="eyebrow">In detail — the namecard</span>
            <Reveal>
              <h2 className="mt-5 max-w-xl font-serif text-[clamp(1.8rem,4vw,3rem)] font-light leading-[1.1] tracking-tight text-ink">
                {redesign.title}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-6 lg:pt-2">
            <p className="text-sm leading-relaxed text-ink/75">{redesign.intro}</p>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {redesign.detail}
            </p>
            <p className="mt-5 border-l border-line pl-5 text-sm leading-relaxed text-muted">
              {redesign.extra}
            </p>
          </Reveal>
        </div>

        {/* Segmented control. Both variants feed the same card, so switching is
            a true A/B on one object rather than two things side by side. */}
        <Reveal delay={0.05} className="mt-14 flex justify-center">
          <div className="relative flex rounded-full border border-line bg-surface p-1">
            {redesign.variants.map((v) => {
              const on = v.key === active
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setActive(v.key)}
                  aria-pressed={on}
                  className={`relative rounded-full px-6 py-2.5 text-xs uppercase tracking-[0.18em] transition-colors duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink/40 ${
                    on ? 'text-canvas' : 'text-muted hover:text-ink'
                  }`}
                >
                  {on && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,#35383f_0%,#212328_58%,#17191d_100%)]"
                    />
                  )}
                  <span className="relative">
                    {v.label} · {v.year}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <CardStage variant={variant.key} faces={variant} />
        </Reveal>
      </div>
    </section>
  )
}
