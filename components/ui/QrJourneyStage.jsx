'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { qrShowcase } from '@/content/site'

gsap.registerPlugin(ScrollTrigger)

const links = [
  { title: 'Visit our Website', icon: '/work/lt-icon-website.png' },
  { title: 'Email', sub: 'agency@nepmarine.com', icon: '/work/lt-icon-gmail.png' },
  { title: 'WhatsApp', icon: '/work/lt-icon-whatsapp.png' },
  { title: 'Heinrich L', icon: '/work/lt-icon-telegram.png' },
  { title: 'WeChat', sub: 'Gallery · 1 photo' },
  { title: 'Viber', sub: 'Gallery · 1 photo' },
]

/* iOS-style status bar. White glyphs read cleanly on every scene here
   (dark wallpaper, black camera, dark Safari chrome). */
function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 pt-3 text-white">
      <span className="text-[0.72rem] font-semibold tracking-tight">9:41</span>
      <span className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 4.4}
              y={7 - i * 2.2}
              width="3"
              height={3 + i * 2.2}
              rx="0.6"
              fill="white"
              opacity={i === 3 ? 0.45 : 1}
            />
          ))}
        </svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 12" fill="white">
          <path d="M8 2.4c2.4 0 4.6.9 6.2 2.4l-1.3 1.4A7 7 0 0 0 8 4.3 7 7 0 0 0 3.1 6.2L1.8 4.8A9 9 0 0 1 8 2.4Z" />
          <path d="M8 6c1.3 0 2.5.5 3.4 1.3l-1.4 1.4A2.9 2.9 0 0 0 8 7.9c-.8 0-1.5.3-2 .8L4.6 7.3A4.9 4.9 0 0 1 8 6Z" />
          <circle cx="8" cy="10" r="1.3" />
        </svg>
        {/* battery */}
        <span className="relative ml-0.5 flex h-[11px] w-[23px] items-center rounded-[3px] border border-white/60 px-[1.5px]">
          <span className="h-[6.5px] w-[16px] rounded-[1.5px] bg-white" />
          <span className="absolute -right-[3px] top-1/2 h-[4px] w-[2px] -translate-y-1/2 rounded-r-sm bg-white/60" />
        </span>
      </span>
    </div>
  )
}

/* Native rebuild of the live Linktree — crisp at any size and genuinely
   scrollable, so it reads exactly like the page you land on after a scan. */
function LinktreeProfile({ pageRef }) {
  return (
    <div ref={pageRef} className="absolute inset-x-0 top-0 will-change-transform">
      {/* Underwater wallpaper */}
      <div className="absolute inset-0">
        <Image
          src="/work/lt-bg.webp"
          alt=""
          fill
          sizes="320px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#04121f]" />
      </div>

      <div className="relative px-5 pb-10 pt-[104px]">
        {/* Avatar */}
        <div className="mx-auto h-[76px] w-[76px] overflow-hidden rounded-full ring-2 ring-white/25 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
          <Image
            src="/work/nepmarine-avatar.jpg"
            alt="Nepmarine"
            width={152}
            height={152}
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="mt-3 text-center text-[0.95rem] font-bold tracking-tight text-white drop-shadow">
          nepmarine.agency
        </h3>

        {/* Social row */}
        <div className="mt-3 flex items-center justify-center gap-4">
          {['/work/lt-icon-whatsapp.png', '/work/lt-icon-telegram.png', '/work/lt-icon-gmail.png'].map(
            (src) => (
              <span
                key={src}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow"
              >
                <Image src={src} alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
              </span>
            ),
          )}
        </div>

        {/* Link buttons */}
        <div className="mt-5 space-y-3">
          {links.map((l) => (
            <div
              key={l.title}
              className="relative flex items-center rounded-2xl border border-white/15 bg-black/35 px-2.5 py-2.5 backdrop-blur-md"
            >
              {l.icon ? (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                  <Image src={l.icon} alt="" width={26} height={26} className="h-[26px] w-[26px] object-contain" />
                </span>
              ) : (
                <span className="h-8 w-8 shrink-0" />
              )}
              <span className="mx-2 flex-1 text-center leading-tight">
                <span className="block text-[0.8rem] font-semibold text-white">{l.title}</span>
                {l.sub && (
                  <span className="mt-0.5 block text-[0.6rem] text-white/70">{l.sub}</span>
                )}
              </span>
              <span className="flex h-8 w-8 shrink-0 flex-col items-center justify-center gap-[2.5px]">
                <span className="h-[3px] w-[3px] rounded-full bg-white/70" />
                <span className="h-[3px] w-[3px] rounded-full bg-white/70" />
                <span className="h-[3px] w-[3px] rounded-full bg-white/70" />
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[0.62rem] font-semibold tracking-wide text-white/80">
          Join {' '}
          <span className="underline">nepmarine.agency</span> on Linktree
        </p>
      </div>
    </div>
  )
}

export default function QrJourneyStage() {
  const root = useRef(null)
  const lock = useRef(null)
  const lockCam = useRef(null)
  const camera = useRef(null)
  const browser = useRef(null)
  const page = useRef(null)
  const reticle = useRef(null)
  const scanBeam = useRef(null)
  const urlBanner = useRef(null)
  const step1 = useRef(null)
  const step2 = useRef(null)
  const step3 = useRef(null)
  const progress = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const S = { active: '#111111', idle: '#a1a1a1' }

      const stepTo = (tl, at, n) => {
        tl.to(step1.current, { color: n === 1 ? S.active : S.idle, opacity: n === 1 ? 1 : 0.5 }, at)
        tl.to(step2.current, { color: n === 2 ? S.active : S.idle, opacity: n === 2 ? 1 : 0.5 }, at)
        tl.to(step3.current, { color: n === 3 ? S.active : S.idle, opacity: n === 3 ? 1 : 0.5 }, at)
        tl.to(progress.current, { scaleX: n / 3 }, at)
      }

      // Resting state before anything plays
      gsap.set(lock.current, { yPercent: 0, autoAlpha: 1 })
      gsap.set(camera.current, { autoAlpha: 0 })
      gsap.set(browser.current, { autoAlpha: 0 })
      gsap.set(reticle.current, { autoAlpha: 0, scale: 1.12 })
      gsap.set(scanBeam.current, { autoAlpha: 0, yPercent: -60 })
      gsap.set(urlBanner.current, { autoAlpha: 0, y: 14 })
      gsap.set(page.current, { yPercent: 0 })
      gsap.set(lockCam.current, { scale: 1, backgroundColor: 'rgba(0,0,0,0.35)' })
      gsap.set(step1.current, { color: S.active, opacity: 1 })
      gsap.set([step2.current, step3.current], { color: S.idle, opacity: 0.5 })
      gsap.set(progress.current, { scaleX: 1 / 3 })

      const build = () => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, defaults: { ease: 'power2.inOut' } })

        // ── Beat 1 · Lock screen (hold) ──
        tl.to({}, { duration: 1.5 })
        // camera button on the lock screen invites the tap
        tl.to(lockCam.current, { backgroundColor: 'rgba(255,255,255,0.9)', scale: 0.9, duration: 0.25 }, '>-0.4')
        tl.to(lockCam.current, { scale: 1, duration: 0.35, ease: 'back.out(2)' })

        // ── Beat 2 · Unlock into camera ──
        stepTo(tl, '<', 2)
        tl.to(lock.current, { yPercent: -104, autoAlpha: 0, duration: 0.7, ease: 'power3.inOut' }, '<')
        tl.to(camera.current, { autoAlpha: 1, duration: 0.5 }, '<0.15')

        // scan sweep + detection
        tl.to(scanBeam.current, { autoAlpha: 1, duration: 0.15 }, '>-0.1')
        tl.to(scanBeam.current, { yPercent: 60, duration: 0.7, ease: 'sine.inOut' }, '<')
        tl.to(reticle.current, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, '<0.1')
        tl.to(scanBeam.current, { autoAlpha: 0, duration: 0.25 }, '>-0.15')
        // lock detected → URL banner
        tl.to(reticle.current, { borderColor: 'rgba(52,199,89,0.95)', boxShadow: '0 0 0 3px rgba(52,199,89,0.35)', duration: 0.25 })
        tl.to(urlBanner.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' }, '<')
        tl.to({}, { duration: 0.7 })

        // ── Beat 3 · Safari + Linktree ──
        stepTo(tl, '<0.1', 3)
        tl.to(camera.current, { autoAlpha: 0, duration: 0.5 }, '<')
        tl.fromTo(
          browser.current,
          { autoAlpha: 0, scale: 1.04 },
          { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
          '<0.1',
        )
        // gently scroll the live-feeling page (kept within populated content)
        tl.to(page.current, { yPercent: -24, duration: 2.6, ease: 'sine.inOut' }, '>0.5')
        tl.to(page.current, { yPercent: -6, duration: 1.4, ease: 'sine.inOut' })
        tl.to({}, { duration: 0.6 })

        // reset detection colour for the next loop
        tl.set(reticle.current, { borderColor: 'rgba(255,255,255,0.9)', boxShadow: 'none' })
        return tl
      }

      const mm = gsap.matchMedia()

      // Play once it scrolls into view; loops thereafter.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = build()
        tl.pause()
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 72%',
          onEnter: () => tl.play(),
          once: true,
        })
        return () => tl.kill()
      })

      // Reduced motion: land on the finished browser state.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(lock.current, { autoAlpha: 0 })
        gsap.set(camera.current, { autoAlpha: 0 })
        gsap.set(browser.current, { autoAlpha: 1 })
        gsap.set([step1.current, step2.current], { color: '#a1a1a1', opacity: 0.5 })
        gsap.set(step3.current, { color: '#111111', opacity: 1 })
        gsap.set(progress.current, { scaleX: 1 })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="flex flex-col items-center">
      {/* Progress rail */}
      <div className="mb-9 w-[min(100%,300px)]">
        <div className="mb-3 h-px w-full overflow-hidden rounded-full bg-line">
          <div ref={progress} className="h-full w-full origin-left scale-x-[0.333] bg-ink/70" />
        </div>
        <div className="flex justify-between">
          {[
            { ref: step1, label: 'Unlock' },
            { ref: step2, label: 'Scan' },
            { ref: step3, label: 'Link opens' },
          ].map(({ ref, label }) => (
            <span
              key={label}
              ref={ref}
              className="font-mono text-[0.58rem] uppercase tracking-[0.2em]"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Phone */}
      <div className="relative w-[288px] sm:w-[300px]">
        <div className="relative overflow-hidden rounded-[2.7rem] border border-ink/10 bg-[#0c0e11] p-[9px] shadow-[0_50px_100px_-40px_rgba(17,19,23,0.45),inset_0_1px_0_rgba(255,255,255,0.14)]">
          {/* side buttons */}
          <div className="absolute -left-[2px] top-[92px] h-8 w-[3px] rounded-l bg-ink/25" />
          <div className="absolute -left-[2px] top-[138px] h-12 w-[3px] rounded-l bg-ink/25" />
          <div className="absolute -left-[2px] top-[196px] h-12 w-[3px] rounded-l bg-ink/25" />
          <div className="absolute -right-[2px] top-[150px] h-16 w-[3px] rounded-r bg-ink/25" />

          <div className="relative aspect-[390/844] overflow-hidden rounded-[2.15rem] bg-black">
            <StatusBar />
            {/* Dynamic island */}
            <div className="absolute left-1/2 top-[11px] z-40 h-[26px] w-[86px] -translate-x-1/2 rounded-full bg-black" />

            {/* ── Layer 3 · Safari + Linktree ── */}
            <div ref={browser} className="absolute inset-0 z-10 bg-[#0b0d10]">
              {/* Safari top chrome (dark) */}
              <div className="absolute inset-x-0 top-0 z-30 bg-black pb-2 pt-11">
                <div className="mx-3 flex items-center gap-2 rounded-xl bg-[#2c2d31] px-3 py-1.5">
                  <svg width="11" height="13" viewBox="0 0 11 13" className="shrink-0 fill-white/70">
                    <path d="M5.5 0a3 3 0 0 0-3 3v1.2H2A1.2 1.2 0 0 0 .8 5.4v5.4A1.2 1.2 0 0 0 2 12h7a1.2 1.2 0 0 0 1.2-1.2V5.4A1.2 1.2 0 0 0 9 4.2h-.5V3a3 3 0 0 0-3-3Zm1.7 4.2H3.8V3a1.7 1.7 0 0 1 3.4 0v1.2Z" />
                  </svg>
                  <span className="flex-1 truncate text-center font-medium text-[0.7rem] text-white">
                    linktr.ee/nepmarine.agency
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0 fill-none stroke-white/60" strokeWidth="2.4">
                    <path d="M4 12a8 8 0 1 0 3-6.3M4 4v3h3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Scrolling page */}
              <div className="absolute inset-x-0 bottom-[54px] top-0 overflow-hidden">
                <LinktreeProfile pageRef={page} />
              </div>

              {/* Safari bottom toolbar */}
              <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-white/[0.06] bg-black px-6 pb-4 pt-2.5 text-white/80">
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-none stroke-[#0a84ff]" strokeWidth="2.2"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-none stroke-white/30" strokeWidth="2.2"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <svg width="18" height="20" viewBox="0 0 24 24" className="fill-none stroke-[#0a84ff]" strokeWidth="2"><path d="M12 3v12m0-12L8 7m4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <svg width="19" height="19" viewBox="0 0 24 24" className="fill-none stroke-[#0a84ff]" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" /></svg>
                <svg width="19" height="19" viewBox="0 0 24 24" className="fill-none stroke-[#0a84ff]" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="3" /><rect x="8" y="8" width="12" height="12" rx="3" /></svg>
              </div>
            </div>

            {/* ── Layer 2 · Camera ── */}
            <div ref={camera} className="absolute inset-0 z-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#242424_0%,#0a0a0a_72%)]" />

              <div className="absolute inset-x-0 top-[52px] flex justify-center">
                <span className="rounded-full bg-black/50 px-3 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                  Scan · QR Code
                </span>
              </div>

              {/* QR presented on a namecard in the viewfinder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="rotate-[-4deg] rounded-2xl bg-white p-3 shadow-[0_30px_60px_-18px_rgba(0,0,0,0.7)]">
                    <div className="relative h-[132px] w-[132px]">
                      <Image src={qrShowcase.qrSrc} alt="" fill sizes="140px" className="object-contain" priority />
                    </div>
                    <p className="mt-1.5 text-center text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-black/70">
                      Nepmarine
                    </p>
                  </div>

                  {/* detection reticle */}
                  <div
                    ref={reticle}
                    className="pointer-events-none absolute -inset-3 rounded-2xl border-2 border-white/90"
                  />
                  {/* scan beam clipped to the code */}
                  <div className="pointer-events-none absolute -inset-3 overflow-hidden rounded-2xl">
                    <div
                      ref={scanBeam}
                      className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-[linear-gradient(90deg,transparent,#34c759,transparent)] shadow-[0_0_14px_rgba(52,199,89,0.7)]"
                    />
                  </div>
                </div>
              </div>

              {/* URL banner on detection */}
              <div ref={urlBanner} className="absolute inset-x-5 top-[30%] flex justify-center">
                <span className="flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] backdrop-blur">
                  <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-black/5">
                    <Image src="/work/lt-icon-website.png" alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
                  </span>
                  <span className="text-left leading-tight">
                    <span className="block text-[0.62rem] font-semibold text-black">linktr.ee</span>
                    <span className="block text-[0.52rem] text-black/55">Open in Safari</span>
                  </span>
                </span>
              </div>

            </div>

            {/* ── Layer 1 · Lock screen ── */}
            <div ref={lock} className="absolute inset-0 z-30 will-change-transform">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,#0f2a3a_0%,#0a1d2b_42%,#050f18_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(80,150,190,0.28),transparent_60%)]" />

              <div className="relative flex h-full flex-col items-center justify-between pb-6 pt-[70px]">
                <div className="flex flex-col items-center">
                  {/* lock glyph */}
                  <svg width="15" height="18" viewBox="0 0 15 18" className="mb-4 fill-white/90">
                    <path d="M7.5 0a4 4 0 0 0-4 4v2.3h-.3A1.7 1.7 0 0 0 1.5 8v7.3A1.7 1.7 0 0 0 3.2 17h8.6a1.7 1.7 0 0 0 1.7-1.7V8a1.7 1.7 0 0 0-1.7-1.7h-.3V4a4 4 0 0 0-4-4Zm2.3 6.3H5.2V4a2.3 2.3 0 0 1 4.6 0v2.3Z" />
                  </svg>
                  <p className="text-[0.85rem] font-medium text-white/85">Wednesday, 5 August</p>
                  <p className="-mt-1 font-sans text-[4.4rem] font-semibold leading-none tracking-tight text-white">
                    9:41
                  </p>
                </div>

                {/* bottom: flashlight + camera, home indicator */}
                <div className="flex w-full flex-col items-center gap-6">
                  <div className="flex w-full items-center justify-between px-9">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 backdrop-blur">
                      <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white"><path d="M9 2h6l-1 6h-4L9 2Zm1 8h4v3a2 2 0 1 1-4 0v-3Z" /></svg>
                    </span>
                    <span
                      ref={lockCam}
                      className="flex h-11 w-11 items-center justify-center rounded-full backdrop-blur"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" className="fill-none stroke-white" strokeWidth="1.8">
                        <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h1.7l1-1.6a1 1 0 0 1 .85-.4h3.9a1 1 0 0 1 .85.4l1 1.6h1.7A1.5 1.5 0 0 1 20 8.5v8A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5v-8Z" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </span>
                  </div>
                  <span className="h-1 w-28 rounded-full bg-white/70" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ground shadow */}
        <div
          aria-hidden="true"
          className="mx-auto mt-6 h-2 w-[70%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(17,19,23,0.1),transparent_72%)]"
        />
      </div>
    </div>
  )
}
