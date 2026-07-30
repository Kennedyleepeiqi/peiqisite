'use client'

import { ArrowUpRight } from 'lucide-react'

/**
 * The site's primary call to action.
 *
 * Hovering runs three things off a single `group` state, deliberately on the
 * same easing so they read as one gesture rather than three effects: a fill
 * rises from the bottom of the pill, the label rolls up and is replaced by an
 * inverted copy of itself, and a specular band crosses the surface once the
 * fill has arrived. Nothing here tracks the cursor — the interaction is the
 * same wherever on the button you happen to enter it.
 */

const VARIANTS = {
  // Ink pill that turns to brushed steel. The fill is a gradient rather than a
  // flat pale tone so it doesn't land on the same colour as the outline variant
  // beside it, and so the specular pass has something to glance off.
  solid: {
    shell: 'bg-ink',
    fill: 'bg-[linear-gradient(100deg,#dcdfe5_0%,#f4f5f8_24%,#c9ccd4_48%,#eef0f3_72%,#d5d8df_100%)]',
    rest: 'text-canvas',
    swap: 'text-ink',
  },
  // Hairline outline that floods with ink.
  outline: {
    shell: 'border border-line hover:border-ink',
    fill: 'bg-ink',
    rest: 'text-ink',
    swap: 'text-canvas',
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

  const label = (tone) => (
    <span className={`flex items-center justify-center gap-2 whitespace-nowrap ${tone}`}>
      {children}
      {icon && <ArrowUpRight className="h-4 w-4" />}
    </span>
  )

  return (
    <Tag
      // `isolate` so the layers below can sit behind the label with a negative
      // z-index while still covering this element's own background.
      className={`group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full transition-[transform,border-color,box-shadow] duration-500 ease-lux hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-16px_rgba(17,17,17,0.45)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none ${tokens.shell} ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 translate-y-full transition-transform duration-[650ms] ease-lux group-hover:translate-y-0 ${tokens.fill}`}
      />

      {/* Delayed so it glances off the risen fill rather than the resting
          surface, which is what makes it read as polish on metal. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 -translate-x-[130%] bg-[linear-gradient(105deg,transparent_38%,rgba(255,255,255,0.45)_50%,transparent_62%)] transition-transform duration-[1100ms] delay-150 ease-lux group-hover:translate-x-[130%]"
      />

      {/* Two copies of the label: the resting one leaves through the top as its
          inverse arrives from below, so the colour never has to cross-fade. */}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-[650ms] ease-lux group-hover:-translate-y-full">
          {label(tokens.rest)}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-[650ms] ease-lux group-hover:translate-y-0"
        >
          {label(tokens.swap)}
        </span>
      </span>
    </Tag>
  )
}
