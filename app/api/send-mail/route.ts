import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { name, phone, email, message } = await req.json()

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.seznam.cz',
    port:   Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  })

  try {
    await transporter.sendMail({
      from:    process.env.SMTP_FROM || 'noreply@bidlivklecanech.cz',
      to:      process.env.MAIL_TO   || 'info@bidli.cz',
      subject: `Nová poptávka – Bidli v Klecanech od ${name}`,
      html: `
        <h2>Nová poptávka z webu Bidli v Klecanech</h2>
        <p><strong>Jméno:</strong> ${name}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Zpráva:</strong><br>${message || '–'}</p>
      `,
    })
    return NextResponse.json({ status: 'success' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ status: 'error', message: 'Chyba odesílání e-mailu' }, { status: 500 })
  }
}
