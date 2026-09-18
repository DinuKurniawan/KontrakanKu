'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  Share2,
  Bookmark,
  Check,
} from 'lucide-react'

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
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const showPrev = useCallback(
    () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length),
    [images.length]
  )
  const showNext = useCallback(
    () => setSelectedIndex((prev) => (prev + 1) % images.length),
    [images.length]
  )
  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (navigator.share) {
        await navigator.share({ title: propertyName, text: propertyName, url: shareUrl })
        return
      }
    } catch {
      // fallback to copy
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

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
  const sideThumbs = images.slice(1, 4)
  const showSeeAll = images.length > 4
  const seeAllCover = images[4] ?? images[3]
  const sideSlots = sideThumbs.length + (showSeeAll ? 1 : 0)

  return (
    <div className="w-full min-w-0">
      <div className="grid w-full grid-cols-1 items-stretch gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        {/* Foto utama */}
        <div className="relative w-full min-w-0 overflow-hidden rounded-[1.75rem] border hairline bg-sand shadow-warm">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Perbesar foto ${selectedIndex + 1} dari ${images.length}`}
            className="block min-h-[240px] w-full cursor-zoom-in sm:min-h-[320px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={active.url}
              src={active.url}
              alt={active.altText || `${propertyName} foto ${selectedIndex + 1}`}
              className="h-[560px] w-full bg-black object-contain sm:h-[680px]"
              draggable={false}
            />
          </button>

          {/* Tombol aksi */}
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label={copied ? 'Tautan tersalin' : 'Bagikan'}
              title={copied ? 'Tautan tersalin' : 'Bagikan'}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/90 text-[#121212] shadow-warm backdrop-blur transition hover:bg-gold"
            >
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setSaved((v) => !v)}
              aria-pressed={saved}
              aria-label={saved ? 'Hapus dari simpanan' : 'Simpan'}
              title={saved ? 'Tersimpan' : 'Simpan'}
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-warm backdrop-blur transition ${
                saved ? 'bg-gold text-[#121212]' : 'bg-ink/90 text-[#121212] hover:bg-gold'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Lihat semua foto"
              title="Lihat semua foto"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/90 text-[#121212] shadow-warm backdrop-blur transition hover:bg-gold"
            >
              <Expand className="h-4 w-4" />
            </button>
          </div>

          {/* Tombol carousel */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrev}
                aria-label="Foto sebelumnya"
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/90 text-[#121212] shadow-warm backdrop-blur transition hover:bg-gold"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Foto berikutnya"
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-[#121212] shadow-warm backdrop-blur transition hover:bg-[#e6c75a]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Kolom thumbnail samping (desktop) */}
        {images.length > 1 && (
          <div
            className="hidden min-h-0 gap-3 lg:grid"
            style={{ gridTemplateRows: `repeat(${sideSlots}, minmax(0, 1fr))` }}
          >
            {sideThumbs.map((img, i) => {
              const realIndex = i + 1
              return (
                <button
                  key={`${img.url}-${realIndex}`}
                  type="button"
                  onClick={() => setSelectedIndex(realIndex)}
                  aria-label={`Lihat foto ${realIndex + 1}`}
                  aria-pressed={realIndex === selectedIndex}
                  className={`relative min-h-0 overflow-hidden rounded-2xl border bg-black transition-all duration-200 ${
                    realIndex === selectedIndex
                      ? 'border-moss ring-2 ring-moss/30'
                      : 'border-line opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain"
                    draggable={false}
                  />
                </button>
              )
            })}
            {showSeeAll && seeAllCover && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`Lihat semua ${images.length} foto`}
                className="group relative min-h-0 overflow-hidden rounded-2xl border border-line bg-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={seeAllCover.url}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  draggable={false}
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-bold text-white transition group-hover:bg-black/65">
                  Lihat Semua
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Strip thumbnail (mobile & tablet) */}
      {images.length > 1 && (
        <div className="mt-3 flex w-full gap-2.5 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] lg:hidden">
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
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${propertyName} diperbesar`}
          onClick={closeLightbox}
          className="fixed inset-0 z-[100] flex h-full w-full items-center justify-center overflow-y-auto bg-pinedeep/90 p-4 backdrop-blur-sm"
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
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-[#121212] shadow-lift transition hover:bg-[#e6c75a]"
            >
              <X className="h-5 w-5" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Foto sebelumnya"
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/90 text-[#121212] shadow-lift transition hover:bg-gold"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Foto berikutnya"
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-[#121212] shadow-lift transition hover:bg-[#e6c75a]"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
