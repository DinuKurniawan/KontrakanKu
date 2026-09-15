'use client'

import { useEffect } from 'react'

/**
 * AutoReveal — progressive enhancement for all public pages.
 * Observes every major block (section + max-w containers) inside <main>
 * and reveals them with a subtle fade-up. Respects prefers-reduced-motion.
 * Works as fallback for browsers without CSS view-timeline support.
 * Paired with globals.css view-timeline animation for modern browsers.
 */
export default function AutoReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // If browser already supports view-timeline, let CSS handle it to avoid double work
    const supportsViewTimeline = CSS.supports('animation-timeline: view()')
    if (supportsViewTimeline) return

    if (!('IntersectionObserver' in window)) return

    const selectors = 'main section, main div[class*="max-w-"]'
    const els = document.querySelectorAll<HTMLElement>(selectors)
    if (els.length === 0) return

    els.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(16px)'
      el.style.willChange = 'opacity, transform'
    })

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const t = entry.target as HTMLElement
            t.style.transition = 'opacity 520ms cubic-bezier(0.16,1,0.3,1), transform 520ms cubic-bezier(0.16,1,0.3,1)'
            t.style.opacity = '1'
            t.style.transform = 'none'
            obs.unobserve(t)
            // clear willChange after animation
            setTimeout(() => {
              t.style.willChange = 'auto'
            }, 560)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    )

    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return null
}
