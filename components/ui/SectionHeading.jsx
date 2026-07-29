'use client'

import Reveal from '@/components/ui/Reveal'

export default function SectionHeading({ index, label }) {
  return (
    <Reveal>
      <div className="flex items-center gap-4 border-b border-line pb-5">
        <span className="font-mono text-xs text-muted">{index}</span>
        <span className="eyebrow">{label}</span>
      </div>
    </Reveal>
  )
}
