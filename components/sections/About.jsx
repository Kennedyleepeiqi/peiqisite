'use client'

import SectionHeading from '@/components/ui/SectionHeading'
import Reveal, { RevealWords } from '@/components/ui/Reveal'
import Marquee from '@/components/ui/Marquee'

const marquee = [
  'Brand Strategy',
  'Art Direction',
  'Interactive Media',
  'Motion',
  'Typography',
  '3D / WebGL',
  'Visual Identity',
  'Creative Coding',
]

const stats = [
  { value: '6+', label: 'Years crafting identities' },
  { value: '40+', label: 'Brands elevated' },
  { value: '12', label: 'Design awards' },
  { value: '∞', label: 'Pixels obsessed over' },
]

export default function About() {
  return (
    <section id="about" className="relative bg-canvas py-28 sm:py-40">
      <div className="container-lux">
        <SectionHeading index="01" label="About" />

        <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="font-serif text-[clamp(1.9rem,4.5vw,3.6rem)] font-light leading-[1.12] tracking-tight text-ink">
              <RevealWords text="I'm a creator with a foundation in Interactive Media and Digital Arts —" />{' '}
              <RevealWords
                text="obsessed with elevating brand identities into something pristine, tactile and unmistakably premium."
                wordClassName="text-muted"
              />
            </h2>
          </div>

          <div className="lg:col-span-4 lg:pt-3">
            <Reveal delay={0.15}>
              <p className="text-sm leading-relaxed text-muted">
                I work at the intersection of design and technology, translating
                abstract brand ambition into precise visual systems and immersive
                web experiences. Every gradient, glyph and interaction is
                engineered to feel considered.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                From full rebrands to a single perfectly-weighted logo, my work is
                guided by restraint, rhythm and an obsession with detail.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {stats.map((s, i) => (
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

      {/* Skills marquee */}
      <Marquee
        items={marquee}
        className="mt-24 border-y border-line py-6"
        itemClassName="font-serif text-2xl font-light italic text-ink/80 sm:text-3xl"
      />
    </section>
  )
}
