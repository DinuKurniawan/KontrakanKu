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

/**
 * Galeri multi-foto sederhana: satu foto besar + panah + thumbnail.
 * Tanpa grid bento — foto utama selalu tampil utuh satu gambar.
 */
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

  // Kunci scroll + navigasi keyboard saat lightbox terbuka
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
      <div className="flex h-[320px] w-full items-center justify-center bg-[#E9E5DD] sm:h-[460px]">
        <div className="flex flex-col items-center gap-3 text-[#0F1F33]/50">
          <div className="flex h-14 w-14 items-center justify-center bg-white border-[1.5px] border-[#0F1F33]">
            <Building2 className="h-6 w-6" />
          </div>
          <span className="font-mono text-sm font-medium">Belum ada foto</span>
        </div>
      </div>
    )
  }

  const active = images[selectedIndex] ?? images[0]

  return (
    <div>
      {/* Foto utama — klik untuk perbesar */}
      <div className="relative h-[320px] w-full overflow-hidden bg-[#E9E5DD] sm:h-[460px]">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Perbesar foto ${selectedIndex + 1} dari ${images.length}`}
          className="block h-full w-full cursor-zoom-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={active.url}
            src={active.url}
            alt={active.altText || `${propertyName} foto ${selectedIndex + 1}`}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-md backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-md backdrop-blur transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur">
          {selectedIndex + 1} / {images.length}
        </span>
        {selectedIndex === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white">
            Sampul
          </span>
        )}
        <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-md backdrop-blur pointer-events-none">
          <Expand className="h-4 w-4" />
        </span>
      </div>

      {/* Thumbnail semua foto */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto bg-white p-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setSelectedIndex(i)}
              aria-label={`Lihat foto ${i + 1}`}
              className={`relative h-[68px] w-[88px] shrink-0 overflow-hidden border-2 transition ${
                i === selectedIndex ? 'border-[#0F1F33]' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" draggable={false} />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Sampul
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox — foto diperbesar */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${propertyName} diperbesar`}
          onClick={closeLightbox}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F1F33]/80 p-4 backdrop-blur-[2px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-4xl items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={active.url}
              src={active.url}
              alt={active.altText || `${propertyName} foto ${selectedIndex + 1}`}
              className="max-h-[86vh] w-auto max-w-full border-[1.5px] border-white object-contain shadow-2xl"
              draggable={false}
            />
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Tutup foto"
              className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-900 shadow-md transition hover:bg-stone-100"
            >
              <X className="h-5 w-5" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Foto sebelumnya"
                  className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-900 shadow-md transition hover:bg-stone-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Foto berikutnya"
                  className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-900 shadow-md transition hover:bg-stone-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur">
              {selectedIndex + 1} / {images.length} · ESC untuk tutup
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
