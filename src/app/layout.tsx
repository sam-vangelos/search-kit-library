import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Search Kit Library',
  description: 'Browse, search, and favorite role-specific boolean sourcing kits',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
