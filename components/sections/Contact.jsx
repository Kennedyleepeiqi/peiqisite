'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import ActionButton from '@/components/ui/ActionButton'
import { contact } from '@/content/site'

/**
 * Add a full profile URL to any platform in content/site.js and it appears in
 * the Elsewhere block. Entries left null are skipped rather than rendered as
 * links to nowhere — an href of '#' silently throws the visitor back to the top
 * of the page, which reads as a broken site.
 */
const socials = contact.socials.filter((s) => s.href)

const projectTypes = [
  'Full rebrand',
  'Logo & visual identity',
  'Print, NFC & collateral',
  'UX/UI design',
  'Business website',
  'Mobile app',
  'Backend / ops software',
  'E-commerce or sales page',
  'Portfolio / personal site',
  'Social media & campaign',
  'Not sure yet',
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
      projectType: form.projectType.value,
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
        <SectionHeading index="05" label="Contact & Enquiries" />

        <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="font-serif text-[clamp(2.2rem,6vw,4.8rem)] font-light leading-[1.02] tracking-tightest text-ink">
                Let&apos;s build something{' '}
                <span className="text-sheen-metal italic">unmistakable</span>.
              </h2>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">
                {contact.intro}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">
                {contact.location}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-12">
                {socials.length > 0 && (
                  <>
                    <p className="eyebrow mb-4">Elsewhere</p>
                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                      {socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-1 text-sm text-ink transition-opacity hover:opacity-60"
                        >
                          {s.label}
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      ))}
                    </div>
                  </>
                )}
                <a
                  href={`mailto:${contact.email}`}
                  className={`inline-block font-serif text-2xl font-light italic text-ink underline decoration-line underline-offset-8 transition-colors hover:decoration-ink ${
                    socials.length > 0 ? 'mt-8' : ''
                  }`}
                >
                  {contact.email}
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
                {/* Chips rather than a dropdown: the options double as a last
                    reminder of everything on offer, right at the point of
                    conversion. */}
                <fieldset>
                  <legend className="eyebrow mb-4">What do you need?</legend>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((t) => (
                      <label key={t} className="cursor-pointer">
                        <input
                          type="radio"
                          name="projectType"
                          value={t}
                          className="peer sr-only"
                        />
                        <span className="inline-block rounded-full border border-line px-4 py-2 text-xs text-muted transition-colors duration-300 hover:border-ink/40 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-canvas peer-focus-visible:ring-1 peer-focus-visible:ring-ink/40 peer-focus-visible:ring-offset-2">
                          {t}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="relative">
                  <textarea id="message" name="message" required rows={4} placeholder="Message" className={`${field} resize-none`} />
                  <label htmlFor="message" className={labelCls}>Tell me about your project</label>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <ActionButton
                    as="button"
                    type="submit"
                    icon
                    disabled={status === 'sending'}
                    data-cursor="Send"
                    className="px-8 py-4 text-sm font-medium disabled:opacity-50"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send enquiry'}
                  </ActionButton>

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
