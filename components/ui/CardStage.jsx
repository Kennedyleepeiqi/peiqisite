'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { RotateCcw } from 'lucide-react'
import useOnScreen from '@/lib/useOnScreen'

// Deferred so the hero's WebGL context is the only one alive on first paint;
// the flat artwork stands in until this arrives.
const CardScene = dynamic(() => import('@/components/ui/CardScene'), {
  ssr: false,
})

export default function CardStage({ variant, faces }) {
  const { ref: stage, warm, visible } = useOnScreen()
  const [calm, setCalm] = useState(false)
  const [flips, setFlips] = useState(0)
  const [showingBack, setShowingBack] = useState(false)
  const [hint, setHint] = useState(true)

  useEffect(() => {
    setCalm(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const onFacing = useCallback((back) => setShowingBack(back), [])

  const flip = () => {
    setFlips((n) => n + 1)
    setHint(false)
  }

  return (
    <div className="relative">
      <div
        ref={stage}
        onPointerDown={() => setHint(false)}
        className="relative isolate aspect-[16/10] overflow-hidden rounded-[28px] bg-[radial-gradient(130%_100%_at_50%_-10%,#2a2d34_0%,#171a1f_45%,#0c0d10_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        {/* Falls back to the flat artwork rather than a hole in the page. */}
        {!warm && (
          <div className="absolute inset-[12%]">
            <Image
              src={faces.front}
              alt={faces.frontAlt}
              fill
              sizes="(min-width: 768px) 60vw, 90vw"
              className="object-contain"
            />
          </div>
        )}

        {warm && (
          <CardScene
            key={variant}
            front={faces.front}
            back={faces.back}
            stock={faces.stock}
            flipSignal={flips}
            onFacing={onFacing}
            calm={calm}
            active={visible}
          />
        )}

        {/* Lens vignette, over the render — pulls the eye to the middle. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_38%,rgba(6,7,10,0.5)_100%)]"
        />

        <div className="pointer-events-none absolute bottom-6 left-6">
          <span
            className={`text-[0.62rem] uppercase tracking-[0.24em] text-canvas/35 transition-opacity duration-700 ${
              hint ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Drag to spin
            <span className="hidden sm:inline"> · Click to flip</span>
          </span>
        </div>

        <button
          type="button"
          onClick={flip}
          className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-canvas/70 backdrop-blur transition-colors duration-300 hover:border-white/30 hover:text-canvas focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-canvas/50"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
          Flip
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        {showingBack ? faces.backLabel : faces.frontLabel}
      </p>
    </div>
  )
}
