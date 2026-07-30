'use client'

import { ArrowUpRight } from 'lucide-react'

/**
 * The site's primary call to action.
 *
 * Both variants are cut from the same metal as the object in the hero: the
 * solid one is its shaded body, the outline one the bright side of the same
 * reflection. Hovering doesn't swap anything out — the surface simply turns
 * into the light, a specular band crosses it, and the pill lifts. The whole
 * gesture is one easing on three layers, and nothing tracks the cursor.
 */

const VARIANTS = {
  solid: {
    shell:
      'bg-[linear-gradient(180deg,#35383f_0%,#212328_58%,#17191d_100%)] text-canvas shadow-[0_10px_24px_-14px_rgba(17,19,23,0.55)] hover:shadow-[0_20px_38px_-16px_rgba(17,19,23,0.6)]',
    // The phase of the metal it turns to: same greys, caught side-on.
    turn: 'bg-[linear-gradient(100deg,#22242a_0%,#3a3d45_28%,#5f636c_46%,#3f424a_64%,#24262c_100%)]',
    sheen:
      'bg-[linear-gradient(105deg,transparent_38%,rgba(255,255,255,0.3)_50%,transparent_62%)]',
    // Light along the top edge, shade along the bottom — the bevel is what
    // stops a dark pill from reading as a flat rectangle of colour.
    bevel:
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(0,0,0,0.55)]',
    ring: 'focus-visible:ring-ink/40 focus-visible:ring-offset-canvas',
  },
  // The same metal read against the dark sections, where a graphite pill would
  // sink into the background.
  light: {
    shell:
      'bg-[linear-gradient(180deg,#fbfbf9_0%,#eceef1_58%,#d9dce3_100%)] text-ink shadow-[0_12px_26px_-14px_rgba(0,0,0,0.7)] hover:shadow-[0_22px_40px_-16px_rgba(0,0,0,0.75)]',
    turn: 'bg-[linear-gradient(100deg,#e4e7ec_0%,#ffffff_26%,#c9cdd6_50%,#f2f3f6_74%,#dee1e7_100%)]',
    sheen:
      'bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.85)_50%,transparent_60%)]',
    bevel:
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.14)]',
    ring: 'focus-visible:ring-canvas/60 focus-visible:ring-offset-ink',
  },
  outline: {
    shell:
      'border border-line text-ink hover:border-[#c3c8d1] hover:shadow-[0_16px_32px_-18px_rgba(17,19,23,0.45)]',
    turn: 'bg-[linear-gradient(100deg,#dfe2e8_0%,#f4f5f8_24%,#cbcfd7_50%,#eaecf0_74%,#dcdfe5_100%)]',
    sheen:
      'bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.75)_50%,transparent_60%)]',
    bevel: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]',
    ring: 'focus-visible:ring-ink/40 focus-visible:ring-offset-canvas',
  },
}

export default function ActionButton({
  as = 'button',
  variant = 'solid',
  icon = false,
  className = '',
  children,
  ...props
}) {
  const Tag = as
  const tokens = VARIANTS[variant] ?? VARIANTS.solid

  return (
    <Tag
      // `isolate` so the surface layers can sit behind the label on a negative
      // z-index while still covering this element's own background.
      className={`group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full transition-[transform,border-color,box-shadow] duration-500 ease-lux hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:pointer-events-none ${tokens.ring} ${tokens.shell} ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 ease-lux group-hover:opacity-100 group-hover:duration-1000 ${tokens.turn}`}
      />

      {/* Delayed so the highlight glances off metal that has already turned,
          rather than off the resting surface. The crossing is deliberately
          unhurried, and eased almost symmetrically — a sharp ease-out would
          fling the band across and leave it crawling at the far edge.
          Duration collapses to zero on the way out so the band resets off-canvas
          instead of visibly sliding back. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 -translate-x-[130%] transition-transform duration-0 group-hover:translate-x-[130%] group-hover:delay-200 group-hover:duration-[2200ms] group-hover:ease-[cubic-bezier(0.4,0,0.25,1)] ${tokens.sheen}`}
      />

      <span className="relative flex items-center justify-center gap-2 whitespace-nowrap">
        {children}
        {icon && (
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-lux group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </span>

      {/* Painted last: an inset shadow on the button itself would be buried by
          the surface layers above it. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-full ${tokens.bevel}`}
      />
    </Tag>
  )
}
