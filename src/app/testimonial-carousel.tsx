'use client'

import { Quote } from 'lucide-react'

export interface TestimonialItem {
  code: string
  name: string
  unit: string
  text: string
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <figure className="flex h-full w-[85vw] max-w-md shrink-0 flex-col rounded-[1.75rem] bg-ink/[0.06] p-7 ring-1 ring-ink/12 backdrop-blur sm:w-[26rem]">
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

export default function TestimonialCarousel({ items }: { items: TestimonialItem[] }) {
  if (items.length === 0) return null

  // Daftar digandakan 3x agar loop marquee mulus tanpa jeda di layar lebar
  const looped = [...items, ...items, ...items]

  return (
    <div className="testimonial-marquee-paused group relative">
      <div
        className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        aria-roledescription="carousel"
        aria-label="Testimoni penyewa berjalan otomatis"
      >
        <div className="animate-testimonial-marquee flex w-max items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5">
          {looped.map((item, i) => (
            <div key={`${item.code}-${i}`} aria-hidden={i >= items.length} className="flex">
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink/40">
        Geser kursor untuk menjeda
      </p>
    </div>
  )
}
