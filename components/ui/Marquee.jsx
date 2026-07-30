'use client'

/**
 * Seamless infinite marquee. The item list is rendered twice at identical
 * width, then the track is translated exactly -50%, so the loop point is
 * invisible. Spacing lives on each item (not as a flex gap) and every item
 * carries a trailing separator, which keeps both halves exactly equal.
 */
export default function Marquee({
  items,
  className = '',
  itemClassName = '',
  reverse = false,
  duration = 42,
}) {
  const Group = ({ hidden }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span className={`whitespace-nowrap ${itemClassName}`}>{item}</span>
          <span
            className="mx-10 inline-block h-[3px] w-[3px] shrink-0 rounded-full bg-ink/30"
            aria-hidden="true"
          />
        </span>
      ))}
    </div>
  )

  return (
    <div className={`marquee marquee-mask flex select-none overflow-hidden ${className}`}>
      <div
        className="marquee-track flex shrink-0"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
          willChange: 'transform',
        }}
      >
        <Group />
        <Group hidden />
      </div>
    </div>
  )
}
