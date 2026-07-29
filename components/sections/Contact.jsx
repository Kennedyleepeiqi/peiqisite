'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import MagneticButton from '@/components/ui/MagneticButton'

const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'Behance', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Dribbble', href: '#' },
]

const field =
  'peer w-full border-b border-line bg-transparent py-4 text-lg text-ink outline-none transition-colors placeholder:text-transparent focus:border-ink'
const labelCls =
  'pointer-events-none absolute left-0 top-4 text-lg text-muted transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setFeedback('')
    const form = e.currentTarget
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      setStatus('success')
      setFeedback(
        json.simulated
          ? 'Message received. (Connect Resend to deliver to your inbox.)'
          : 'Thank you — your message is on its way.',
      )
      form.reset()
    } catch (err) {
      setStatus('error')
      setFeedback(err.message || 'Something went wrong.')
    }
  }

  return (
    <section id="contact" className="relative bg-canvas py-28 sm:py-40">
      <div className="container-lux">
        <SectionHeading index="04" label="Contact & Enquiries" />

        <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="font-serif text-[clamp(2.2rem,6vw,4.8rem)] font-light leading-[1.02] tracking-tightest text-ink">
                Let&apos;s build something{' '}
                <span className="italic holo-text animate-shimmer">timeless</span>.
              </h2>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">
                Have a brand to elevate or an idea to realise? Tell me about it —
                I read every enquiry personally.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-12">
                <p className="eyebrow mb-4">Elsewhere</p>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="group flex items-center gap-1 text-sm text-ink transition-opacity hover:opacity-60"
                    >
                      {s.label}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ))}
                </div>
                <a
                  href="mailto:hello@peiqi.studio"
                  className="mt-8 inline-block font-serif text-2xl font-light italic text-ink underline decoration-line underline-offset-8 transition-colors hover:decoration-ink"
                >
                  hello@peiqi.studio
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="relative">
                  <input id="name" name="name" type="text" required placeholder="Name" className={field} />
                  <label htmlFor="name" className={labelCls}>Name</label>
                </div>
                <div className="relative">
                  <input id="email" name="email" type="email" required placeholder="Email" className={field} />
                  <label htmlFor="email" className={labelCls}>Email</label>
                </div>
                <div className="relative">
                  <textarea id="message" name="message" required rows={4} placeholder="Message" className={`${field} resize-none`} />
                  <label htmlFor="message" className={labelCls}>Tell me about your project</label>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <MagneticButton
                    as="button"
                    type="submit"
                    disabled={status === 'sending'}
                    data-cursor="Send"
                    className="group gap-2 rounded-full bg-ink px-8 py-4 text-sm font-medium text-canvas disabled:opacity-50"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send enquiry'}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-lux group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </MagneticButton>

                  {feedback && (
                    <p
                      className={`text-sm ${
                        status === 'error' ? 'text-red-500' : 'text-ink'
                      }`}
                    >
                      {feedback}
                    </p>
                  )}
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
