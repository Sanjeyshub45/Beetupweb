import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Beetup by Fnext - List Your Events',
  description: 'The easiest way to organize, promote, and manage your gatherings.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden`} suppressHydrationWarning>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster theme="dark" position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}

