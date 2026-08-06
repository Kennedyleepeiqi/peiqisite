'use client'

import { motion } from 'framer-motion'
import {
  Activity,
  Database,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

const nav = [
  { Icon: LayoutDashboard, label: 'Overview', active: true },
  { Icon: Users, label: 'Clients' },
  { Icon: Database, label: 'Inventory' },
  { Icon: Activity, label: 'Analytics' },
  { Icon: Shield, label: 'Access' },
  { Icon: Settings, label: 'Settings' },
]

const bars = [38, 52, 44, 68, 58, 72, 64, 80, 74, 88, 82, 92]

const rows = [
  { id: 'ORD-9284', client: 'Pacific Lines', amount: '$12,400', status: 'Completed', tone: 'text-emerald-600 bg-emerald-500/10' },
  { id: 'ORD-9281', client: 'Harbour Co.', amount: '$8,920', status: 'Processing', tone: 'text-amber-600 bg-amber-500/10' },
  { id: 'ORD-9278', client: 'Atlas Freight', amount: '$24,100', status: 'Pending', tone: 'text-ink/60 bg-ink/5' },
]

const logs = [
  'POST /api/v1/orders · 201 Created',
  'GET /api/v1/inventory · 200 OK',
  'Webhook delivery · success',
]

export default function BackendVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1, ease }}
      className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_50px_90px_-56px_rgba(17,19,23,0.5)]"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-[#f4f3f1] px-4 py-2.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-line" />
        ))}
        <span className="ml-2 flex-1 truncate rounded-md bg-white px-3 py-1 font-mono text-[0.58rem] text-muted">
          admin.nepmarine.org/dashboard
        </span>
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.5rem] font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>

      <div className="flex min-h-[340px] bg-[#fafaf8] sm:min-h-[380px]">
        {/* Sidebar */}
        <div className="hidden w-[148px] shrink-0 border-r border-line bg-white p-3 sm:block">
          <div className="mb-4 flex items-center gap-2 px-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-[0.5rem] font-bold text-canvas">
              N
            </div>
            <span className="text-[0.62rem] font-medium text-ink">Ops Console</span>
          </div>
          <nav className="space-y-0.5">
            {nav.map(({ Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[0.58rem] ${
                  active
                    ? 'bg-ink text-canvas'
                    : 'text-muted hover:bg-ink/[0.03]'
                }`}
              >
                <Icon className="h-3 w-3" strokeWidth={1.75} />
                {label}
              </div>
            ))}
          </nav>
        </div>

        {/* Main panel */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[0.55rem] uppercase tracking-[0.18em] text-muted">
                Operations overview
              </div>
              <div className="mt-0.5 font-serif text-lg font-light text-ink sm:text-xl">
                Dashboard
              </div>
            </div>
            <div className="hidden rounded-lg border border-line bg-white px-3 py-1.5 text-[0.55rem] text-muted sm:block">
              Last sync · 2m ago
            </div>
          </div>

          {/* KPI row */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: 'Revenue', value: '$284K', delta: '+12%' },
              { label: 'Orders', value: '1,842', delta: '+8%' },
              { label: 'Uptime', value: '99.9%', delta: 'Stable' },
            ].map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease }}
                className="rounded-xl border border-line bg-white p-2.5 sm:p-3"
              >
                <div className="text-[0.48rem] uppercase tracking-[0.14em] text-muted sm:text-[0.5rem]">
                  {k.label}
                </div>
                <div className="mt-1 font-serif text-base font-light text-ink sm:text-xl">
                  {k.value}
                </div>
                <div className="mt-0.5 text-[0.48rem] text-emerald-600 sm:text-[0.5rem]">
                  {k.delta}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart + table */}
          <div className="mt-3 grid flex-1 grid-cols-1 gap-3 sm:grid-cols-5">
            <div className="rounded-xl border border-line bg-white p-3 sm:col-span-2">
              <div className="text-[0.5rem] uppercase tracking-[0.16em] text-muted">
                Monthly volume
              </div>
              <div className="mt-3 flex h-[72px] items-end gap-[3px] sm:h-[88px]">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm bg-[linear-gradient(180deg,#2a3344_0%,#111318_100%)]"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + i * 0.04,
                      duration: 0.7,
                      ease,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-line bg-white sm:col-span-3">
              <div className="border-b border-line px-3 py-2 text-[0.5rem] uppercase tracking-[0.16em] text-muted">
                Recent orders
              </div>
              <div className="divide-y divide-line">
                {rows.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.55, ease }}
                    className="flex items-center justify-between gap-2 px-3 py-2 text-[0.58rem]"
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-ink/80">{r.id}</div>
                      <div className="truncate text-muted">{r.client}</div>
                    </div>
                    <div className="hidden text-ink sm:block">{r.amount}</div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.48rem] ${r.tone}`}>
                      {r.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal strip */}
          <div className="mt-3 overflow-hidden rounded-xl border border-ink/10 bg-[#0d0f12] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[0.48rem] uppercase tracking-[0.16em] text-white/40">
                API activity
              </span>
              <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
            </div>
            <div className="space-y-1 font-mono text-[0.52rem] leading-relaxed text-emerald-400/90">
              {logs.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.12, duration: 0.5 }}
                >
                  <span className="text-white/30">&gt; </span>
                  {line}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
