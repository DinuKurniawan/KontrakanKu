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
        className="inline-flex items-center gap-1.5 rounded-none border-[1.5px] border-[#0F1F33] bg-white px-3.5 py-2 font-mono text-xs font-bold text-[#0F1F33] shadow-sm transition hover:bg-[#0F1F33] hover:text-white"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
        {copied ? 'Tersalin' : 'Bagikan'}
      </button>
      <button
        type="button"
        onClick={() => setSaved((v) => !v)}
        aria-pressed={saved}
        className={`inline-flex items-center gap-1.5 rounded-none border-[1.5px] px-3.5 py-2 font-mono text-xs font-bold shadow-sm transition ${
          saved
            ? 'border-[#D93D30] bg-[#D93D30] text-white'
            : 'border-[#0F1F33] bg-white text-[#0F1F33] hover:bg-[#0F1F33] hover:text-white'
        }`}
      >
        <Heart className={`h-3.5 w-3.5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
        Simpan
      </button>
    </div>
  )
}
