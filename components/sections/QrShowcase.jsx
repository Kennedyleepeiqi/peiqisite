'use client'

import Reveal from '@/components/ui/Reveal'
import QrJourneyStage from '@/components/ui/QrJourneyStage'
import { qrShowcase } from '@/content/site'

export default function QrShowcase() {
  return (
    <section id="qr-showcase" className="relative bg-canvas pb-28 sm:pb-40">
      <div className="container-lux">
        <div className="grid grid-cols-1 items-center gap-12 border-t border-line pt-10 lg:grid-cols-12 lg:gap-14">
          {/* Left — copy */}
          <div className="lg:col-span-6">
            <span className="eyebrow">{qrShowcase.eyebrow}</span>
            <Reveal>
              <h2 className="mt-5 max-w-xl font-serif text-[clamp(1.8rem,4vw,3rem)] font-light leading-[1.1] tracking-tight text-ink">
                {qrShowcase.title}{' '}
                <span className="text-sheen-metal italic">{qrShowcase.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink/75">
                {qrShowcase.intro}
              </p>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">
                {qrShowcase.detail}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {qrShowcase.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — phone storyboard */}
          <div className="lg:col-span-6">
            <QrJourneyStage />
          </div>
        </div>
      </div>
    </section>
  )
}
