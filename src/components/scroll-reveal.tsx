'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none' | 'zoom'
  delay?: number // in ms
  duration?: number // in ms
  threshold?: number
  /** Tambahan scale awal (0–1), hanya aktif saat direction='zoom' atau dikombinasikan */
  scale?: number
  /** Jika true, animasi tidak diulang saat elemen keluar viewport lagi (default: true) */
  once?: boolean
}

/**
 * Komponen ScrollReveal:
 * Memberikan animasi transisi halus (fade, slide, zoom) ketika elemen memasuki viewport saat scrolling.
 * Menggunakan IntersectionObserver dengan akselerasi hardware GPU (will-change: opacity, transform).
 * Mendukung direction: up | down | left | right | none | zoom
 * Menghormati prefers-reduced-motion.
 */
export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 650,
  threshold = 0.12,
  scale,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Jika pengguna mengaktifkan prefers-reduced-motion, hindari animasi transisi
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    // Fallback jika browser lawas tidak mendukung IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setIsVisible(false)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -48px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  const getInitialTransform = (): string => {
    const translatePart = (() => {
      switch (direction) {
        case 'up':
          return 'translateY(32px)'
        case 'down':
          return 'translateY(-32px)'
        case 'left':
          return 'translateX(32px)'
        case 'right':
          return 'translateX(-32px)'
        case 'zoom':
          return 'scale(0.88)'
        case 'none':
        default:
          return ''
      }
    })()

    // Jika ada scale prop tambahan (misal scale={0.95})
    if (scale !== undefined && direction !== 'zoom') {
      return translatePart ? `${translatePart} scale(${scale})` : `scale(${scale})`
    }

    return translatePart || 'none'
  }

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'none' : getInitialTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  }

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}
