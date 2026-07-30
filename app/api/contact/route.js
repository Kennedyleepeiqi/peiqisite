import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request) {
  try {
    const { name, email, message, projectType } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in every field.' },
        { status: 400 },
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.CONTACT_TO_EMAIL

    // Allow the UI to work before credentials are configured.
    if (!apiKey || !to) {
      console.warn('[contact] RESEND_API_KEY / CONTACT_TO_EMAIL not set — skipping send.')
      return NextResponse.json({
        ok: true,
        simulated: true,
        message: 'Received (email delivery not yet configured).',
      })
    }

    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'Peiqi Portfolio <onboarding@resend.dev>',
      to,
      replyTo: email,
      subject: projectType
        ? `New enquiry from ${name} — ${projectType}`
        : `New enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nLooking for: ${projectType || 'Not specified'}\n\n${message}`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] send failed:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
