'use client'

/**
 * Seamless infinite marquee. The item list is rendered twice at identical
 * width, then the track is translated exactly -50%, so the loop point is
 * invisible. Spacing lives on each item (not as a flex gap) to keep both
 * halves perfectly equal.
 */
export default function Marquee({
  items,
  className = '',
  itemClassName = '',
  reverse = false,
  duration = 38,
}) {
  const Group = ({ hidden }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className={`shrink-0 whitespace-nowrap px-8 ${itemClassName}`}>
          {item}
        </span>
      ))}
    </div>
  )

  return (
    <div className={`flex select-none overflow-hidden ${className}`}>
      <div
        className="flex shrink-0"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <Group />
        <Group hidden />
      </div>
    </div>
  )
}
