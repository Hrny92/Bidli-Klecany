import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Bidli v Klecanech',
    template: '%s | Bidli v Klecanech',
  },
  description: 'Exkluzivní pozemky s vydaným stavebním povolením v Klecanech 5 km od Prahy. Vyberte si: jen pozemek nebo pozemek s rodinným domem 5+kk ve hrubé stavbě.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  )
}
