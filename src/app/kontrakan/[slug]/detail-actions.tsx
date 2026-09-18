'use client'

import { useState } from 'react'
import { Heart, Share2, Check } from 'lucide-react'

export function HeaderActions({ title, url }: { title: string; url: string }) {
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
    const shareData = { title, text: title, url: shareUrl }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
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

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="chip !border-line !bg-white font-semibold hover:!border-moss"
      >
        {copied ? <Check className="h-4 w-4 text-fern" /> : <Share2 className="h-4 w-4" />}
        {copied ? 'Tersalin' : 'Bagikan'}
      </button>
      <button
        type="button"
        onClick={() => setSaved((v) => !v)}
        aria-pressed={saved}
        className={`chip font-semibold ${saved ? 'chip-on' : '!border-line !bg-white hover:!border-moss'}`}
      >
        <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        Simpan
      </button>
    </div>
  )
}
