'use client'

import ScrollReveal from '@/components/scroll-reveal'
import { ReactNode } from 'react'

/**
 * Tiny wrapper sehingga halaman Server Component /kontrakan/[slug]/page.tsx
 * bisa menggunakan ScrollReveal yang butuh 'use client'.
 */

export function SR({
  children,
  direction = 'up',
  delay = 0,
  duration = 620,
  className = '',
  scale,
}: {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none' | 'zoom'
  delay?: number
  duration?: number
  className?: string
  scale?: number
}) {
  return (
    <ScrollReveal direction={direction} delay={delay} duration={duration} className={className} scale={scale}>
      {children}
    </ScrollReveal>
  )
}
