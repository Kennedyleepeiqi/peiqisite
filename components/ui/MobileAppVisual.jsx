'use client'

import { motion } from 'framer-motion'
import {
  Bell,
  ChevronRight,
  Home,
  LayoutGrid,
  Package,
  User,
} from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

const orders = [
  { id: 'NEP-2841', status: 'In transit', tone: 'bg-emerald-500/15 text-emerald-700' },
  { id: 'NEP-2839', status: 'Processing', tone: 'bg-amber-500/15 text-amber-700' },
  { id: 'NEP-2836', status: 'Delivered', tone: 'bg-ink/8 text-ink/70' },
]

export default function MobileAppVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Ambient glow behind the device */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(ellipse_at_50%_60%,rgba(17,19,23,0.08),transparent_70%)]"
      />

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1.1, ease }}
        className="relative"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
        {/* Phone shell */}
        <div className="relative overflow-hidden rounded-[2.4rem] border border-ink/10 bg-[#0d0f12] p-[10px] shadow-[0_40px_80px_-24px_rgba(17,19,23,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]">
          {/* Side buttons */}
          <div className="absolute -left-[2px] top-[88px] h-8 w-[3px] rounded-l bg-ink/20" />
          <div className="absolute -left-[2px] top-[132px] h-12 w-[3px] rounded-l bg-ink/20" />
          <div className="absolute -right-[2px] top-[108px] h-16 w-[3px] rounded-r bg-ink/20" />

          {/* Screen */}
          <div className="relative overflow-hidden rounded-[1.85rem] bg-[#f6f6f4]">
            {/* Dynamic island */}
            <div className="absolute left-1/2 top-3 z-10 h-[22px] w-[72px] -translate-x-1/2 rounded-full bg-[#0d0f12]" />

            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[0.55rem] font-medium text-ink/50">
              <span>9:41</span>
              <span className="flex gap-1">
                <span className="h-2 w-3 rounded-sm border border-ink/30" />
                <span className="h-2 w-2 rounded-full bg-ink/30" />
              </span>
            </div>

            {/* App header */}
            <div className="flex items-center justify-between px-5 pb-4 pt-8">
              <div>
                <div className="text-[0.55rem] uppercase tracking-[0.2em] text-muted">
                  Nepmarine
                </div>
                <div className="mt-0.5 font-serif text-lg font-light text-ink">
                  Operations
                </div>
              </div>
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-ink text-canvas">
                <Bell className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#f6f6f4]" />
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-2 px-4">
              {[
                { label: 'Active', value: '24', sub: 'vessels tracked' },
                { label: 'Today', value: '8', sub: 'new requests' },
              ].map((k, i) => (
                <motion.div
                  key={k.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease }}
                  className="rounded-2xl border border-ink/[0.06] bg-white p-3 shadow-[0_8px_24px_-16px_rgba(17,19,23,0.2)]"
                >
                  <div className="text-[0.5rem] uppercase tracking-[0.16em] text-muted">
                    {k.label}
                  </div>
                  <div className="mt-1 font-serif text-2xl font-light text-ink">
                    {k.value}
                  </div>
                  <div className="mt-0.5 text-[0.55rem] text-muted">{k.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Live map strip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.8, ease }}
              className="mx-4 mt-3 overflow-hidden rounded-2xl border border-ink/[0.06] bg-[linear-gradient(135deg,#1a2744_0%,#0f1729_100%)] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.5rem] uppercase tracking-[0.18em] text-white/50">
                  Live coverage
                </span>
                <span className="flex items-center gap-1 text-[0.5rem] text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  13 ports
                </span>
              </div>
              <div className="relative mt-3 h-16 overflow-hidden rounded-xl bg-[#0a1220]">
                {/* Stylised map dots */}
                {[
                  [20, 30], [45, 22], [62, 38], [78, 18], [35, 48], [55, 52],
                ].map(([x, y], i) => (
                  <motion.span
                    key={i}
                    className="absolute h-1.5 w-1.5 rounded-full bg-[#c9a962]/80"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
                <svg
                  className="absolute inset-0 h-full w-full opacity-30"
                  viewBox="0 0 200 64"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M10 40 Q 50 20, 90 35 T 190 25"
                    fill="none"
                    stroke="#c9a962"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Order list */}
            <div className="mt-3 px-4 pb-20">
              <div className="mb-2 text-[0.5rem] uppercase tracking-[0.18em] text-muted">
                Recent shipments
              </div>
              <div className="space-y-2">
                {orders.map((o, i) => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 + i * 0.08, duration: 0.6, ease }}
                    className="flex items-center justify-between rounded-xl border border-ink/[0.05] bg-white px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink/[0.04]">
                        <Package className="h-3.5 w-3.5 text-ink/60" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="text-[0.65rem] font-medium text-ink">{o.id}</div>
                        <div className={`mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[0.45rem] ${o.tone}`}>
                          {o.status}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted" strokeWidth={1.5} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom tab bar */}
            <div className="absolute bottom-0 inset-x-0 flex items-center justify-around border-t border-ink/[0.06] bg-white/95 px-4 py-3 backdrop-blur-md">
              {[
                { Icon: Home, active: true },
                { Icon: LayoutGrid, active: false },
                { Icon: Package, active: false },
                { Icon: User, active: false },
              ].map(({ Icon, active }, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-0.5 ${active ? 'text-ink' : 'text-muted'}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={active ? 2 : 1.5} />
                  {active && (
                    <span className="h-0.5 w-0.5 rounded-full bg-ink" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        </motion.div>
      </motion.div>

      {/* Reflection */}
      <div
        aria-hidden="true"
        className="mx-auto mt-4 h-3 w-[70%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(17,19,23,0.12),transparent_70%)] blur-sm"
      />
    </div>
  )
}
