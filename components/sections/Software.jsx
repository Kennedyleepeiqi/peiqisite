'use client'

import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import MobileAppVisual from '@/components/ui/MobileAppVisual'
import BackendVisual from '@/components/ui/BackendVisual'
import ActionButton from '@/components/ui/ActionButton'
import { software } from '@/content/site'

export default function Software() {
  const [mobile, backend] = software.pillars

  return (
    <section
      id="software"
      className="relative overflow-hidden bg-canvas py-28 sm:py-40"
    >
      {/* Subtle grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[20%] top-[10%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(17,19,23,0.04),transparent_70%)]"
      />

      <div className="container-lux relative">
        <SectionHeading index="03" label="Apps & Systems" />

        <Reveal>
          <h2 className="mt-14 max-w-3xl font-serif text-[clamp(1.9rem,4.5vw,3.4rem)] font-light leading-[1.1] tracking-tight text-ink">
            {software.title}{' '}
            <span className="text-sheen-metal italic">{software.titleAccent}</span>
          </h2>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {software.intro}
          </p>
        </Reveal>

        {/* Mobile apps */}
        <div className="mt-24 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:col-span-5">
            <span className="eyebrow">{mobile.label}</span>
            <h3 className="mt-5 font-serif text-[clamp(1.6rem,3.5vw,2.4rem)] font-light leading-[1.08] tracking-tight text-ink">
              {mobile.title}
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {mobile.desc}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {mobile.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
              {mobile.stats.map((s) => (
                <div key={s.label} className="bg-surface p-5">
                  <div className="font-serif text-2xl font-light text-ink">
                    {s.value}
                  </div>
                  <div className="mt-2 text-[0.65rem] leading-snug text-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12} className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative rounded-[2rem] border border-line bg-[linear-gradient(160deg,#ffffff_0%,#f3f2ef_100%)] p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,169,98,0.08),transparent_55%)]"
              />
              <MobileAppVisual />
            </div>
          </Reveal>
        </div>

        {/* Backend / operations */}
        <div className="mt-28 grid grid-cols-1 items-center gap-12 lg:mt-36 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <BackendVisual />
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-5">
            <span className="eyebrow">{backend.label}</span>
            <h3 className="mt-5 font-serif text-[clamp(1.6rem,3.5vw,2.4rem)] font-light leading-[1.08] tracking-tight text-ink">
              {backend.title}
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {backend.desc}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {backend.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
              {backend.stats.map((s) => (
                <div key={s.label} className="bg-surface p-5">
                  <div className="font-serif text-2xl font-light text-ink">
                    {s.value}
                  </div>
                  <div className="mt-2 text-[0.65rem] leading-snug text-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-20 border-t border-line pt-10">
          <ActionButton
            as="a"
            href="#contact"
            variant="outline"
            icon
            data-cursor="Say hi"
            className="px-7 py-4 text-sm font-medium"
          >
            Discuss your app or system
          </ActionButton>
        </Reveal>
      </div>
    </section>
  )
}
