import type { ReactNode } from 'react'
import PublicNavbar from './public-navbar'
import PublicFooter from './public-footer'
import WhatsAppFloat from './whatsapp-float'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-public flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-paper text-ink antialiased">
      <PublicNavbar />
      <main className="w-full min-w-0 flex-1 overflow-x-clip">{children}</main>
      <PublicFooter />
      <WhatsAppFloat />
    </div>
  )
}
