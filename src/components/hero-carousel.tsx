"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DURATION = 7000;

const SLIDES = [
  { src: "/images/1.webp", alt: "Deretan unit kontrakan yang terawat" },
  { src: "/images/859964_720.webp", alt: "Koridor terang dan area parkir" },
  { src: "/images/073424800_1429960385-3.webp", alt: "Bangunan kontrakan dua lantai" },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = SLIDES.length;

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), DURATION);
    return () => clearTimeout(t);
  }, [paused, index, count]);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[2rem] bg-sand"
      aria-roledescription="carousel"
      aria-label="Foto kontrakan"
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
      <div className="relative h-[420px] w-full sm:h-[520px] lg:h-full lg:min-h-[560px]">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              i === index ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover ${i === index ? "hero-zoom" : ""}`}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-pinedeep/50 via-pinedeep/5 to-transparent"
              aria-hidden
            />
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-5 sm:p-6">
          <div className="rounded-full bg-pinedeep/45 px-4 py-2.5 backdrop-blur-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/85">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")} · Foto asli unit
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="mr-1 hidden items-center gap-1.5 sm:flex">
              {SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ke foto ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 bg-paper" : "w-1.5 bg-paper/50 hover:bg-paper/80"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={prev}
              aria-label="Foto sebelumnya"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/90 text-pine backdrop-blur transition-all duration-200 hover:bg-paper"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Foto berikutnya"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-pine text-paper transition-all duration-200 hover:bg-pinedeep"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
