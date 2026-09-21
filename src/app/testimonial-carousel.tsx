'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Quote, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

export interface TestimonialItem {
  code: string
  name: string
  unit: string
  text: string
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <figure className="flex h-full w-full flex-col rounded-[1.75rem] bg-ink/[0.06] p-7 ring-1 ring-ink/12 backdrop-blur sm:p-8">
      <Quote className="h-6 w-6 fill-gold text-gold" aria-hidden />
      <blockquote className="mt-4 flex-1 font-display text-[1.05rem] leading-7 text-ink/90">
        “{item.text}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/12 pt-5">
        <span
          aria-hidden
          className="tick rounded-lg bg-gold/15 px-2.5 py-1.5 font-mono text-xs font-bold text-gold"
        >
          {item.code}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-ink">{item.name}</span>
          <span className="block truncate font-mono text-[11px] uppercase tracking-[0.12em] text-ink/55">
            {item.unit}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

const AUTOPLAY_MS = 6000

export default function TestimonialCarousel({ items }: { items: TestimonialItem[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const touchX = useRef<number | null>(null)
  const count = items.length

  const goTo = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count]
  )
  const prev = useCallback(() => goTo(index - 1), [goTo, index])
  const next = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const autoplay = !paused && !reduceMotion && count > 1

  useEffect(() => {
    if (!autoplay) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [autoplay, index, count])

  if (count === 0) return null

  const active = items[index]

  return (
    <div
      className="relative"
      aria-roledescription="carousel"
      aria-label="Testimoni penyewa"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (dx > 40) prev()
        else if (dx < -40) next()
        touchX.current = null
      }}
    >
      <div className="overflow-hidden" aria-live="polite">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transitionDuration: reduceMotion ? '0ms' : undefined,
          }}
        >
          {items.map((item) => (
            <div
              key={item.code}
              className="w-full shrink-0 px-0 sm:px-8"
              aria-hidden={item.code !== active.code}
            >
              <div className="mx-auto max-w-2xl">
                <TestimonialCard item={item} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Testimoni sebelumnya"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/10 text-ink ring-1 ring-ink/15 transition hover:bg-gold hover:text-[#14211B]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Pilih testimoni">
          {items.map((item, i) => (
            <button
              key={item.code}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Testimoni ${i + 1}: ${item.name}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-gold' : 'w-2 bg-ink/30 hover:bg-ink/60'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Testimoni berikutnya"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/10 text-ink ring-1 ring-ink/15 transition hover:bg-gold hover:text-[#14211B]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-label={paused ? 'Putar otomatis testimoni' : 'Jeda testimoni otomatis'}
          aria-pressed={paused}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/10 text-ink ring-1 ring-ink/15 transition hover:bg-gold hover:text-[#14211B]"
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink/40">
        {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </p>
    </div>
  )
}
