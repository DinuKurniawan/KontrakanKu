"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const DURATION = 6000;

const SLIDES = [
  {
    src: "/images/1.webp",
    alt: "Deretan unit kontrakan yang terawat",
    eyebrow: "Cilandak · Dikelola sejak 2018",
    title: "Tinggal tenang di selatan Jakarta.",
    desc: "Kontrakan keluarga yang terawat — token mandiri per kamar, tagihan tercatat rapi, dan pengelola yang menjawab langsung via WhatsApp.",
    ctaPrimary: { label: "Lihat unit tersedia", href: "/kontrakan" },
    ctaSecondary: { label: "Masuk", href: "/login" },
  },
  {
    src: "/images/859964_720.webp",
    alt: "Koridor terang dan area parkir",
    eyebrow: "Siap survei minggu ini",
    title: "Foto asli, siap survei kapan saja.",
    desc: "Unit difoto ulang tiap kali penghuni keluar. Survei pukul 08.00–18.00 setiap hari — janjian via WhatsApp.",
    ctaPrimary: { label: "Jelajahi unit", href: "/kontrakan" },
    ctaSecondary: { label: "Cara sewa", href: "/faq" },
  },
  {
    src: "/images/073424800_1429960385-3.webp",
    alt: "Bangunan kontrakan dua lantai",
    eyebrow: "BCA · Mandiri · BNI · BRI",
    title: "Bayar transfer, pantau sampai LUNAS.",
    desc: "Upload bukti dari HP, diverifikasi admin, dan riwayat tersimpan rapi untuk perpanjangan berikutnya.",
    ctaPrimary: { label: "Lihat unit tersedia", href: "/kontrakan" },
    ctaSecondary: { label: "Masuk dashboard", href: "/login" },
  },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const touchX = useRef<number | null>(null);
  const count = SLIDES.length;

  const goTo = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count]
  );
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), DURATION);
    return () => clearTimeout(t);
  }, [paused, reduceMotion, index, count]);

  return (
    <div
      className="relative h-[740px] w-full overflow-hidden bg-pinedeep sm:h-[800px] lg:h-[860px]"
      aria-roledescription="carousel"
      aria-label="Banner promo kontrakan"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx > 40) prev();
        else if (dx < -40) next();
        touchX.current = null;
      }}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === index
              ? "z-10 opacity-100"
              : "pointer-events-none z-0 opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover ${
              i === index && !reduceMotion ? "hero-zoom" : ""
            }`}
          />
          {/* Overlay agar teks terbaca */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-pinedeep/85 via-pinedeep/55 to-pinedeep/15"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-pinedeep/60 to-transparent"
            aria-hidden
          />
        </div>
      ))}

      {/* Konten teks per slide */}
      <div className="shell relative z-20 flex h-full w-full items-center">
        <div className="max-w-2xl pb-10">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              aria-hidden={i !== index}
              className={i === index ? "animate-fade-up block" : "hidden"}
            >
              <p className="eyebrow eyebrow-on-dark">{slide.eyebrow}</p>
              <h1 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl">
                {slide.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                {slide.desc}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={slide.ctaPrimary.href}
                  tabIndex={i === index ? 0 : -1}
                  className="btn-elegant-primary !px-7 !py-3.5 !text-[15px]"
                >
                  {slide.ctaPrimary.label} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={slide.ctaSecondary.href}
                  tabIndex={i === index ? 0 : -1}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white ring-1 ring-white/50 transition hover:bg-white/10"
                >
                  {slide.ctaSecondary.label}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kontrol: dots + arrows + counter */}
      <div className="shell absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 pb-6">
        <div className="flex items-center gap-3">
          <p className="rounded-full bg-black/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-1.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ke banner ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Banner sebelumnya"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-200 hover:bg-white hover:text-[#121212]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Banner berikutnya"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-[#121212] transition-all duration-200 hover:bg-[#e6c75a]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Progress bar autoplay */}
      {!reduceMotion && !paused && (
        <div
          key={index}
          className="absolute inset-x-0 top-0 z-20 h-1 origin-left bg-gold/90"
          style={{ animation: `banner-progress ${DURATION}ms linear both` }}
          aria-hidden
        />
      )}
      <style>{`@keyframes banner-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </div>
  );
}
