'use client'

import { useCallback, useEffect, useState } from 'react'
import { Building2, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'

type GalleryImage = {
  url: string
  altText?: string | null
}

interface GalleryViewerProps {
  images: GalleryImage[]
  propertyName: string
}

export default function GalleryViewer({ images, propertyName }: GalleryViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const showPrev = useCallback(
    () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length),
    [images.length]
  )
  const showNext = useCallback(
    () => setSelectedIndex((prev) => (prev + 1) % images.length),
    [images.length]
  )
  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  useEffect(() => {
    if (!lightboxOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox()
      else if (event.key === 'ArrowLeft') showPrev()
      else if (event.key === 'ArrowRight') showNext()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [lightboxOpen, closeLightbox, showPrev, showNext])

  if (images.length === 0) {
    return (
      <div className="flex h-[320px] w-full items-center justify-center rounded-[1.75rem] bg-sand sm:h-[420px]">
        <div className="flex flex-col items-center gap-2 text-fog">
          <Building2 className="h-8 w-8" />
          <span className="text-sm">Belum ada foto</span>
        </div>
      </div>
    )
  }

  const active = images[selectedIndex] ?? images[0]

  return (
    <div className="w-full min-w-0">
      <div className="relative w-full overflow-hidden rounded-[1.75rem] border hairline bg-sand shadow-warm">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Perbesar foto ${selectedIndex + 1} dari ${images.length}`}
          className="block w-full cursor-zoom-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={active.url}
            src={active.url}
            alt={active.altText || `${propertyName} foto ${selectedIndex + 1}`}
            className="h-[440px] w-full object-cover sm:h-[600px] lg:h-[720px]"
            draggable={false}
          />
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Foto sebelumnya"
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-pine backdrop-blur transition hover:bg-paper"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Foto berikutnya"
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-pine text-paper transition hover:bg-pinedeep"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <span className="tick absolute bottom-4 right-4 rounded-full bg-pinedeep/55 px-3.5 py-1.5 text-xs font-semibold text-paper backdrop-blur-md">
          {selectedIndex + 1} / {images.length}
        </span>
        <span className="pointer-events-none absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-pine shadow-warm">
          <Expand className="h-4 w-4" />
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex w-full gap-2.5 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setSelectedIndex(i)}
              aria-label={`Lihat foto ${i + 1}`}
              aria-pressed={i === selectedIndex}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition-all duration-200 ${
                i === selectedIndex
                  ? 'border-moss ring-2 ring-moss/30'
                  : 'border-line opacity-55 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" loading="lazy" className="h-full w-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <dialog
          open
          aria-label={`Foto ${propertyName} diperbesar`}
          onClick={closeLightbox}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-pinedeep/90 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-pop relative flex max-h-[90vh] w-full max-w-4xl items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={active.url}
              src={active.url}
              alt={active.altText || `${propertyName} foto ${selectedIndex + 1}`}
              className="max-h-[86vh] w-auto max-w-full rounded-[1.75rem] object-contain shadow-lift"
              draggable={false}
            />
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Tutup foto"
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-pine shadow-lift transition hover:bg-goldsoft"
            >
              <X className="h-5 w-5" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Foto sebelumnya"
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-pine shadow-lift transition hover:bg-paper"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Foto berikutnya"
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-pine shadow-lift transition hover:bg-paper"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </dialog>
      )}
    </div>
  )
}
