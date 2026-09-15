'use client'

import { Star } from 'lucide-react'

export interface TestimonialItem {
  name: string
  initials: string
  unit: string
  quote: string
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <figure className="flex h-full w-[82vw] max-w-sm shrink-0 flex-col rounded-3xl border border-stone-200/80 bg-stone-50 p-5 shadow-sm sm:w-[26rem] sm:p-6">
      <div className="flex items-center gap-1" aria-label="Peringkat 5 dari 5">
        {Array.from({ length: 5 }).map((_, starIdx) => (
          <Star key={starIdx} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-stone-600">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-stone-200/70 pt-4">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white"
        >
          {item.initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-stone-900">{item.name}</span>
          <span className="block truncate text-xs text-stone-500">{item.unit}</span>
        </span>
      </figcaption>
    </figure>
  )
}

export default function TestimonialCarousel({ items }: { items: TestimonialItem[] }) {
  if (items.length === 0) return null

  // Daftar digandakan agar loop marquee mulus tanpa jeda
  const looped = [...items, ...items]

  return (
    <div className="testimonial-marquee-paused group relative">
      <div
        className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        aria-roledescription="carousel"
        aria-label="Testimoni penyewa berjalan otomatis"
      >
        <div className="animate-testimonial-marquee flex w-max gap-4 pr-4 sm:gap-6 sm:pr-6">
          {looped.map((item, i) => (
            <div key={`${item.name}-${i}`} aria-hidden={i >= items.length}>
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
