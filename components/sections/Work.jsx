'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ImagePlus } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import ActionButton from '@/components/ui/ActionButton'
import { caseStudy, pieces } from '@/content/site'

gsap.registerPlugin(ScrollTrigger)

const CARD = 'h-[58vh] shrink-0 sm:h-[70vh]'

export default function Work() {
  const section = useRef(null)
  const stage = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        const el = track.current
        // Measured on every refresh rather than once at setup. A single baked
        // measurement is taken before the rail has finished laying out, and any
        // overshoot becomes dead scroll with the last card dragged off-screen.
        const distance = () =>
          Math.max(0, el.scrollWidth - window.innerWidth + 64)

        // The pin is on the rail alone, not the whole section — the case study
        // above it has to scroll past normally before the gallery takes over.
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: stage.current,
            start: 'top top',
            end: () => `+=${distance()}`,
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

  // Keep any card video playing whenever it is on screen. The rail is
  // translated horizontally, so browsers pause off-screen video to save
  // power — this resumes it the moment the card scrolls back into view.
  useEffect(() => {
    const vids = section.current?.querySelectorAll('video') ?? []
    if (!vids.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.play().catch(() => {})
          else e.target.pause()
        })
      },
      { threshold: 0.1 },
    )
    vids.forEach((v) => io.observe(v))
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="work"
      ref={section}
      className="relative overflow-hidden bg-canvas py-28 sm:py-40"
    >
      <div className="container-lux">
        <SectionHeading index="04" label="Selected Work" />

        <Reveal>
          <h2 className="mt-14 max-w-3xl font-serif text-[clamp(1.9rem,4.5vw,3.4rem)] font-light leading-[1.1] tracking-tight text-ink">
            One brand, carried across every surface.
          </h2>
        </Reveal>

        {/* Featured case */}
        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow">Featured case</span>
            <h3 className="mt-5 font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-[1.05] tracking-tight text-ink">
              {caseStudy.client}
            </h3>

            <dl className="mt-8 border-t border-line text-sm">
              {[
                ['Sector', caseStudy.sector],
                ['Location', caseStudy.location],
                ['Year', caseStudy.year],
              ].map(([term, value]) => (
                <div
                  key={term}
                  className="flex justify-between border-b border-line py-3"
                >
                  <dt className="text-muted">{term}</dt>
                  <dd className="text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-base leading-relaxed text-ink/80">
              {caseStudy.summary}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {caseStudy.detail}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {caseStudy.scope.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line px-4 py-1.5 text-xs text-muted"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-10">
              <ActionButton
                as="a"
                href={caseStudy.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                icon
                data-cursor="Visit"
                className="px-6 py-3.5 text-sm font-medium"
              >
                View the live site
              </ActionButton>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-7">
            {/* Browser chrome, so the screenshot reads as a shipped website
                rather than a flat image. */}
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_50px_90px_-56px_rgba(17,19,23,0.55)]">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2.5 w-2.5 rounded-full bg-line" />
                ))}
                <span className="ml-3 truncate rounded-full bg-canvas px-3 py-1 font-mono text-[0.62rem] text-muted">
                  nepmarine.org
                </span>
              </div>
              <div className="relative aspect-[16/10]">
                <Image
                  src="/work/nepmarine-site.jpg"
                  alt="Nepmarine Agency homepage, showing the hero headline over a container vessel"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {caseStudy.results.map((r) => (
                <div key={r.label} className="bg-surface p-5">
                  <div className="font-serif text-2xl font-light text-ink sm:text-3xl">
                    {r.value}
                  </div>
                  <div className="mt-2 text-[0.68rem] leading-snug text-muted">
                    {r.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-28 flex items-baseline justify-between border-t border-line pt-8">
          <span className="eyebrow">Every piece</span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-muted sm:block">
            Scroll →
          </span>
        </div>
      </div>

      {/* Pinned gallery rail */}
      <div
        ref={stage}
        className="mt-12 sm:flex sm:min-h-[100svh] sm:items-center"
      >
        <div
          ref={track}
          className="flex gap-6 overflow-x-auto px-6 pb-6 sm:overflow-visible sm:px-16 sm:pb-0"
        >
          {pieces.map((p) =>
            p.kind === 'sample' ? (
              // Waiting slots are built to the same spec as a finished card,
              // so a rail that isn't full yet still reads as designed.
              <div
                key={p.id}
                className={`${CARD} flex w-[66vw] flex-col overflow-hidden rounded-3xl border border-line bg-surface sm:w-[32vw] lg:w-[23vw]`}
              >
                <div className="flex flex-1 bg-[linear-gradient(160deg,#f6f6f4_0%,#ececeb_100%)] p-7">
                  <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15">
                    <ImagePlus className="h-6 w-6 text-ink/25" strokeWidth={1.25} />
                    <span className="mt-4 text-[0.62rem] uppercase tracking-[0.24em] text-muted">
                      Sample slot
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-5">
                  <div className="min-w-0">
                    <div className="truncate text-sm text-ink">{p.label}</div>
                    <div className="truncate text-xs text-muted">{p.note}</div>
                  </div>
                  <span className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                    {p.category}
                  </span>
                </div>
              </div>
            ) : (
              <article
                key={p.id}
                data-cursor="View"
                className={`${CARD} group flex w-[80vw] flex-col overflow-hidden rounded-3xl border border-line bg-surface sm:w-[52vw] lg:w-[40vw]`}
              >
                {p.video ? (
                  <div className="relative flex-1 overflow-hidden">
                    <video
                      src={p.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                ) : p.fit === 'cover' ? (
                  // Anchored to the top left, not the centre. A screenshot is
                  // wider than this card, and a centred crop eats into the
                  // headline and logo — the two things worth showing.
                  <div className="relative flex-1 overflow-hidden">
                    <Image
                      src={p.src}
                      alt={`${p.client} — ${p.note}`}
                      fill
                      sizes="(min-width: 1024px) 40vw, 80vw"
                      className="object-cover object-left-top origin-top-left transition-transform duration-[1.2s] ease-lux group-hover:scale-[1.04]"
                    />
                  </div>
                ) : (
                  // Flat artwork sits on a soft field rather than filling the
                  // card, so a namecard still reads as a namecard.
                  <div className="relative flex-1 bg-[linear-gradient(160deg,#f6f6f4_0%,#ececeb_100%)] p-8 sm:p-12">
                    <div className="relative h-full w-full">
                      <Image
                        src={p.src}
                        alt={`${p.client} — ${p.note}`}
                        fill
                        sizes="(min-width: 1024px) 40vw, 80vw"
                        className="object-contain drop-shadow-[0_24px_44px_rgba(17,19,23,0.18)] transition-transform duration-[1.2s] ease-lux group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-5">
                  <div className="min-w-0">
                    <div className="truncate text-sm text-ink">{p.label}</div>
                    <div className="truncate text-xs text-muted">{p.note}</div>
                  </div>
                  <span className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                    {p.client}
                  </span>
                </div>
              </article>
            ),
          )}

          <a
            href="#contact"
            data-cursor="Let's talk"
            className={`${CARD} group flex w-[80vw] flex-col items-center justify-center rounded-3xl border border-dashed border-ink/30 sm:w-[34vw] lg:w-[26vw]`}
          >
            <span className="flex items-center gap-3 font-serif text-3xl font-light italic text-ink transition-transform duration-500 group-hover:-translate-y-1">
              Your brand next?
              <ArrowUpRight className="h-6 w-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
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
