'use client'

import { useMemo, useState } from 'react'
import { BarChart3 } from 'lucide-react'

export type MonthlySeries = { year: number; months: number[] }
export type YearlySeries = { year: number; total: number }

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

function formatFullIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatShortIDR(value: number): string {
  if (value >= 1_000_000_000) {
    const v = value / 1_000_000_000
    return `Rp${Number(v.toFixed(v < 10 ? 1 : 0)).toLocaleString('id-ID')} M`
  }
  if (value >= 1_000_000) {
    const v = value / 1_000_000
    return `Rp${Number(v.toFixed(v < 10 ? 1 : 0)).toLocaleString('id-ID')} jt`
  }
  if (value >= 1_000) {
    const v = value / 1_000
    return `Rp${Number(v.toFixed(v < 10 ? 1 : 0)).toLocaleString('id-ID')} rb`
  }
  return `Rp${value.toLocaleString('id-ID')}`
}

/** Bulatkan batas atas sumbu-Y ke angka "cantik" agar garis grid enak dibaca. */
function niceCeil(value: number): number {
  if (value <= 0) return 0
  const power = 10 ** Math.floor(Math.log10(value))
  const n = value / power
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
  return nice * power
}

function Bars({
  values,
  labels,
  subLabels,
  wide = false,
  alwaysShowValue = false,
}: {
  values: number[]
  labels: string[]
  subLabels?: string[]
  wide?: boolean
  alwaysShowValue?: boolean
}) {
  const max = niceCeil(Math.max(...values, 0))
  const ticks = [1, 0.75, 0.5, 0.25]

  if (max === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-sm text-stone-400">
        Belum ada pemasukan tercatat pada periode ini.
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Grid + label sumbu Y */}
      <div className="absolute inset-0 flex flex-col justify-between pb-7 pl-1 pointer-events-none" aria-hidden>
        {ticks.map((t) => (
          <div key={t} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-[10px] text-stone-400 text-right">
              {formatShortIDR(max * t)}
            </span>
            <div className="flex-1 border-t border-dashed border-stone-200" />
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-[10px] text-stone-400 text-right">Rp0</span>
          <div className="flex-1 border-t border-stone-200" />
        </div>
      </div>

      {/* Batang */}
      <div className={`relative flex items-end gap-1 sm:gap-2 h-56 ml-[4.25rem] ${wide ? 'justify-around' : ''}`}>
        {values.map((value, i) => {
          const heightPct = value > 0 ? Math.max((value / max) * 100, 3) : 0
          return (
            <div
              key={i}
              className={`group relative flex-1 ${wide ? 'max-w-24' : 'max-w-12'} h-full flex flex-col items-center justify-end`}
            >
              {(alwaysShowValue || value > 0) && (
                <span
                  className={`mb-1 text-[10px] font-bold text-stone-700 whitespace-nowrap ${
                    alwaysShowValue ? '' : 'opacity-0 group-hover:opacity-100 transition'
                  }`}
                >
                  {formatShortIDR(value)}
                </span>
              )}
              <div
                title={`${subLabels?.[i] ?? labels[i]}: ${formatFullIDR(value)}`}
                style={{ height: `${heightPct}%` }}
                className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-emerald-700 to-emerald-400 group-hover:from-emerald-800 group-hover:to-emerald-500 transition cursor-default min-h-0"
              />
              <span className="mt-1.5 h-4 text-[10px] sm:text-[11px] font-medium text-stone-500">
                {labels[i]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function RevenueChart({
  monthlySeries,
  yearlySeries,
  defaultYear,
}: {
  monthlySeries: MonthlySeries[]
  yearlySeries: YearlySeries[]
  defaultYear: number
}) {
  const [mode, setMode] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedYear, setSelectedYear] = useState(defaultYear)

  const activeMonthly = useMemo(
    () => monthlySeries.find((s) => s.year === selectedYear) ?? monthlySeries[monthlySeries.length - 1],
    [monthlySeries, selectedYear]
  )
  const monthlyTotal = useMemo(
    () => (activeMonthly ? activeMonthly.months.reduce((a, b) => a + b, 0) : 0),
    [activeMonthly]
  )
  const yearlyTotal = useMemo(() => yearlySeries.reduce((a, b) => a + b.total, 0), [yearlySeries])
  const bestYear = useMemo(
    () => yearlySeries.reduce((best, cur) => (cur.total > best.total ? cur : best), yearlySeries[0]),
    [yearlySeries]
  )

  return (
    <div className="h-full rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Grafik Pemasukan</h3>
            <p className="text-xs text-stone-500">
              Pemasukan dari pembayaran yang telah diverifikasi (APPROVED)
            </p>
          </div>
        </div>

        {/* Toggle Bulanan / Tahunan */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl self-start">
          {(
            [
              { key: 'monthly', label: 'Bulanan' },
              { key: 'yearly', label: 'Tahunan' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setMode(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === tab.key
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'monthly' ? (
        <>
          {/* Pilihan tahun */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-stone-500 font-medium">Tahun:</span>
            {monthlySeries.map((s) => (
              <button
                key={s.year}
                type="button"
                onClick={() => setSelectedYear(s.year)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  selectedYear === s.year
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {s.year}
              </button>
            ))}
          </div>

          {activeMonthly && (
            <Bars
              values={activeMonthly.months}
              labels={MONTH_LABELS}
              subLabels={MONTH_NAMES.map((m) => `${m} ${activeMonthly.year}`)}
            />
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 pt-4 border-t border-stone-100 text-xs">
            <span className="text-stone-500">
              Total {activeMonthly?.year}:{' '}
              <strong className="text-stone-900">{formatFullIDR(monthlyTotal)}</strong>
            </span>
            <span className="text-stone-500">
              Rata-rata/bulan:{' '}
              <strong className="text-stone-900">{formatFullIDR(Math.round(monthlyTotal / 12))}</strong>
            </span>
          </div>
        </>
      ) : (
        <>
          <Bars
            values={yearlySeries.map((y) => y.total)}
            labels={yearlySeries.map((y) => String(y.year))}
            subLabels={yearlySeries.map((y) => `Tahun ${y.year}`)}
            wide
            alwaysShowValue
          />

          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 pt-4 border-t border-stone-100 text-xs">
            <span className="text-stone-500">
              Total {yearlySeries.length} tahun terakhir:{' '}
              <strong className="text-stone-900">{formatFullIDR(yearlyTotal)}</strong>
            </span>
            {bestYear && yearlyTotal > 0 && (
              <span className="text-stone-500">
                Tertinggi: <strong className="text-emerald-800">{bestYear.year}</strong> (
                {formatFullIDR(bestYear.total)})
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
