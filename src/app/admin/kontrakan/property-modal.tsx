'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPropertyAction, updatePropertyAction, deletePropertyAction, PropertyActionState } from './actions'
import { generateSlug } from '@/lib/validations/sanitizer'
import { X, Building2, MapPin, Image as ImageIcon, Loader2, UploadCloud, Trash2 } from 'lucide-react'

interface PropertyModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property?: any
}

// Batas total foto per kontrakan: 1 sampul + 4 galeri
const MAX_PROPERTY_PHOTOS = 5

export default function PropertyModal({ isOpen, onClose, property }: PropertyModalProps) {
  const router = useRouter()
  const isEdit = !!property
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<PropertyActionState | null>(null)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugCustom, setIsSlugCustom] = useState(false)
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [monthlyPriceFrom, setMonthlyPriceFrom] = useState('')
  const [status, setStatus] = useState('PUBLISHED')
  const [facilities, setFacilities] = useState<string[]>([])
  const [coverImageUrls, setCoverImageUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (property) {
      setName(property.name || '')
      setSlug(property.slug || '')
      setIsSlugCustom(true)
      setAddress(property.address || '')
      setDescription(property.description || '')
      setMonthlyPriceFrom(property.monthlyPriceFrom ? String(property.monthlyPriceFrom) : '')
      setStatus(property.status || 'PUBLISHED')
      setFacilities(property.facilities || [])
      const urls = Array.isArray(property.images) ? property.images.map((im: any) => im.url).filter(Boolean) : []
      setCoverImageUrls(urls.length > 0 ? urls : (property.images?.[0]?.url ? [property.images[0].url] : []))
    } else {
      setName('')
      setSlug('')
      setIsSlugCustom(false)
      setAddress('')
      setDescription('')
      setMonthlyPriceFrom('')
      setStatus('PUBLISHED')
      setFacilities(['WiFi', 'Kamar Mandi Dalam', 'Parkir Motor'])
      setCoverImageUrls([])
    }
    setState(null)
  }, [property, isOpen])

  function handleNameChange(val: string) {
    setName(val)
    if (!isSlugCustom) {
      setSlug(generateSlug(val))
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (files.length === 0) return

    const remaining = MAX_PROPERTY_PHOTOS - coverImageUrls.length
    if (remaining <= 0) {
      setUploadError(`Batas maksimal ${MAX_PROPERTY_PHOTOS} foto tercapai. Hapus salah satu foto untuk mengganti.`)
      return
    }

    const accepted = files.slice(0, remaining)
    setIsUploading(true)
    setUploadError(
      files.length > remaining
        ? `Hanya ${remaining} foto pertama yang diunggah (batas maksimal ${MAX_PROPERTY_PHOTOS} foto).`
        : null
    )

    for (const file of accepted) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'property')
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.success && data.url) {
          setCoverImageUrls(prev => [...prev, data.url])
        } else {
          setUploadError(data.error || 'Gagal mengunggah foto properti')
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Terjadi gangguan jaringan saat mengunggah foto'
        setUploadError(msg)
      }
    }
    setIsUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState(null)

    if (coverImageUrls.length > MAX_PROPERTY_PHOTOS) {
      setState({ error: `Maksimal ${MAX_PROPERTY_PHOTOS} foto per kontrakan. Hapus ${coverImageUrls.length - MAX_PROPERTY_PHOTOS} foto sebelum menyimpan.` })
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('slug', slug)
    formData.append('address', address)
    formData.append('description', description)
    formData.append('monthlyPriceFrom', monthlyPriceFrom)
    formData.append('status', status)
    coverImageUrls.forEach(url => formData.append('coverImageUrls', url))
    if (coverImageUrls[0]) formData.append('coverImageUrl', coverImageUrls[0])
    formData.append('facilitiesString', facilities.join(','))

    startTransition(async () => {
      let res: PropertyActionState | undefined
      if (isEdit) {
        res = await updatePropertyAction(property.id, undefined, formData)
      } else {
        res = await createPropertyAction(undefined, formData)
      }

      if (res?.success) {
        router.refresh()
        onClose()
      } else {
        setState(res || { error: 'Terjadi kesalahan sistem' })
      }
    })
  }

  async function handleDelete() {
    if (!property?.id) return
    if (
      !confirm(
        `Yakin ingin menghapus kontrakan "${property.name}"? Seluruh unit di dalamnya yang belum memiliki transaksi sewa juga akan terhapus secara permanen.`
      )
    ) {
      return
    }

    startTransition(async () => {
      const res = await deletePropertyAction(property.id)
      if (res.success) {
        router.refresh()
        onClose()
      } else {
        setState({ error: res.error || 'Gagal menghapus kontrakan' })
      }
    })
  }

  if (!isOpen) return null

  return (
    <div onClick={e => { if (e.target === e.currentTarget && !isPending) onClose() }} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/60 p-4 backdrop-blur-sm">
      <div onClick={e => e.stopPropagation()} className="my-8 w-full max-w-2xl overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-stone-900">
                {isEdit ? 'Edit Data Kontrakan' : 'Tambah Kontrakan Baru'}
              </h3>
              <p className="mt-0.5 text-xs text-stone-500">
                Informasi kompleks kontrakan yang dapat dilihat oleh calon penyewa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {state?.error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-800">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Nama Kontrakan */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Nama Kontrakan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="Contoh: Kontrakan Melati Indah"
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
              />
              {state?.fieldErrors?.name && (
                <p className="mt-1 text-[11px] text-rose-600">{state.fieldErrors.name[0]}</p>
              )}
            </div>

            {/* Slug URL */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Slug URL (Alamat Web) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => {
                  setSlug(e.target.value)
                  setIsSlugCustom(true)
                }}
                placeholder="kontrakan-melati-indah"
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 font-mono text-xs text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
              />
              {state?.fieldErrors?.slug && (
                <p className="mt-1 text-[11px] text-rose-600">{state.fieldErrors.slug[0]}</p>
              )}
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div>
            <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              <MapPin className="h-3.5 w-3.5 text-stone-400" />
              Alamat Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Jl. Melati No. 12, RT 02 / RW 05, Kelurahan Sukajadi..."
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
            />
            {state?.fieldErrors?.address && (
              <p className="mt-1 text-[11px] text-rose-600">{state.fieldErrors.address[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Harga Mulai Dari */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Harga Mulai Dari (Rp/bln) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={monthlyPriceFrom}
                onChange={e => setMonthlyPriceFrom(e.target.value)}
                placeholder="1200000"
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm tabular-nums text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
              />
              {state?.fieldErrors?.monthlyPriceFrom && (
                <p className="mt-1 text-[11px] text-rose-600">{state.fieldErrors.monthlyPriceFrom[0]}</p>
              )}
            </div>

            {/* Status Publikasi */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
              >
                <option value="PUBLISHED">PUBLISHED (Tampil di Publik)</option>
                <option value="DRAFT">DRAFT (Disimpan Draf)</option>
                <option value="ARCHIVED">ARCHIVED (Diarsipkan)</option>
              </select>
            </div>
          </div>

          {/* Foto Sampul & Galeri — maks 5 (pertama = sampul) */}
          <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                <ImageIcon className="h-3.5 w-3.5 text-stone-400" />
                Foto Sampul & Galeri (Opsional)
              </label>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                {coverImageUrls.length}/{MAX_PROPERTY_PHOTOS} foto {coverImageUrls.length > 0 && '• pertama = sampul'}
              </span>
            </div>

            {coverImageUrls.length > 0 && (
              <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {coverImageUrls.map((url, idx) => (
                  <div key={`${url}-${idx}`} className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Foto ${idx + 1}`} className="h-24 w-full object-cover" />
                    <span className={`absolute left-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${idx === 0 ? 'bg-emerald-600 text-white' : 'bg-stone-900/70 text-white'}`}>
                      {idx === 0 ? 'Sampul' : `#${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCoverImageUrls(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute right-1.5 top-1.5 rounded-full bg-white p-1 text-stone-500 shadow transition hover:bg-rose-50 hover:text-rose-600"
                      title="Hapus foto"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="truncate bg-white px-1.5 py-1 font-mono text-[10px] text-stone-500">{url}</p>
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => setCoverImageUrls(prev => {
                          const arr = [...prev]
                          const [item] = arr.splice(idx, 1)
                          arr.unshift(item)
                          return arr
                        })}
                        className="w-full border-t border-stone-100 bg-stone-50 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        Jadikan sampul
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {coverImageUrls.length === 0 && (
              <p className="mb-3 rounded-xl border border-dashed border-stone-200 bg-white px-3 py-3 text-center text-xs text-stone-400">Belum ada foto — unggah di bawah.</p>
            )}

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || coverImageUrls.length >= MAX_PROPERTY_PHOTOS}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 bg-white px-3 py-2.5 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                <span>
                  {coverImageUrls.length >= MAX_PROPERTY_PHOTOS
                    ? `Batas ${MAX_PROPERTY_PHOTOS} foto tercapai`
                    : isUploading
                      ? 'Mengompres...'
                      : `Unggah foto (maks ${MAX_PROPERTY_PHOTOS - coverImageUrls.length} lagi)`}
                </span>
              </button>
            </div>

            {uploadError && <p className="mt-1 text-[11px] text-rose-600">{uploadError}</p>}
            {state?.fieldErrors?.coverImageUrls && (
              <p className="mt-1 text-[11px] text-rose-600">{state.fieldErrors.coverImageUrls[0]}</p>
            )}
            <p className="mt-2 text-[11px] leading-relaxed text-stone-400">Foto pertama otomatis jadi sampul di katalog. Urutan bisa diubah dengan “Jadikan sampul”. Maksimal {MAX_PROPERTY_PHOTOS} foto (1 sampul + 4 galeri).</p>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tuliskan keterangan suasana kontrakan, kemudahan akses transportasi, dsb."
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/60 px-6 py-4 -mx-6 -mb-6 mt-2">
            <div>
              {isEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus Kontrakan
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isEdit ? 'Simpan Perubahan' : 'Tambah Kontrakan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
