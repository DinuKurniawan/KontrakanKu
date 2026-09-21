"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";

const DURATION = 7000;

const SLIDES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSDxq7D_HspB78MdUqfFnk1zbt38ecCFb4ThlOOTSpo63ZiPl3Yda1oO0OzHQb8EddPbhZo8ocDH4lvPg78v3KRfmP7nkqfb_fjKUxygiHg4iZ9P-XgAAOJgDujB7f8U7dJxjhY7L4uqp6mRmUM9RyuhyvFiC17UDmloCoIvf7NSJtWC7HF10O2kfUHhK4c2mi1XJot-CqhuNTSIeKjgPAVCjLgawUsmRl4tcDtd8",
    alt: "Cluster kontrakan asri dengan taman tropis dan paving terakota",
    badge: "Hunian Kontrakan Aman • Dikelola Langsung Pemilik",
    badgeClass: "bg-[#bdeddb] text-[#002018]",
    icon: "verified",
    title: "Hunian Nyaman, Tenang, & Penuh Kekeluargaan.",
    desc: "Pilihan tepat untuk keluarga muda dan pasangan yang mengutamakan ketenteraman di Sukamaju Cilodong. Bebas banjir, pengawasan CCTV 24 jam, dan tetangga yang hangat.",
    primary: { label: "Lihat Pilihan Unit", href: "/kontrakan" },
    secondary: {
      label: "Jadwalkan Survei Lokasi",
      href: "https://wa.me/6281234567890?text=Halo%20Bapak/Ibu%20Griya%20Teduh,%20saya%20ingin%20jadwalkan%20survei%20lokasi",
    },
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2ujEq6q7U4L7q92v9oRsFFY6umJ2vKhsDLXY6axwlOsrhrAvf_lRj9a0pT3q4UPuQFKHKZzwoyRU4wW0NQp7dFPvWi2ZepvHii_3gCzjTQYxbZmXBr0cyjF925dxmVpf2K6OZe7BLFZ1_aXNHWuSUfWG8L-f5rTktlPjysEFfw0nXFoG0rQdosdMyVUrHhEC9ylsmo9Wq14miNQpMNBiA6oKEhLhvYb_LYk2Gw4c",
    alt: "Interior paviliun bersih dengan lantai keramik terang",
    badge: "Interior Luas & Pencahayaan Alami",
    badgeClass: "bg-[#ffdeae] text-[#281900]",
    icon: "star",
    title: "Sirkulasi Udara Adem, Ruang Mandiri Lega.",
    desc: "Setiap unit didesain memiliki ventilasi silang, dapur bersih mandiri, serta pencahayaan matahari alami yang menyehatkan keluarga.",
    primary: { label: "Eksplorasi Tipe Paviliun", href: "/kontrakan" },
    secondary: null,
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDud47LpIS0psfJqqvzd8fYBrrCuSmXG1kxLbw5Ic8-2dWvEG7Ng2CrHb2DND6U_3V9qiCcI-4tkR27q1fg2qfq-v6eazjYSCVshlBf9qzSTX7Cjkofn_mMSQqhxVXtIfLjRwieDyuz_VpKHRfRFUUMJAyifE1uBaVS-IkJPv3UNhzofvbDIZvR8kXk7_JA4nUhdxOK9QOp_ZR959RypmPB1y5t_L7kUoWNk-aVkOU",
    alt: "Taman halaman dalam yang rindang dan tenang",
    badge: "Lingkungan Tenang & Aman 24 Jam",
    badgeClass: "bg-[#ffdbce] text-[#79310e]",
    icon: "shield",
    title: "Keamanan Terjaga, Ramah Bermain Anak.",
    desc: "One gate system dengan portal malam tertutup rapat dan CCTV 24 jam. Halaman paving rapi 5 meter, aman bagi balita beraktivitas riang.",
    primary: {
      label: "Tanya Pengelola",
      href: "https://wa.me/6281234567890?text=Halo%20Pak%20Rahman,%20saya%20tertarik%20tanya%20lingkungan%20Griya%20Teduh",
    },
    secondary: null,
  },
] as const;

function SlideIcon({ name }: { name: (typeof SLIDES)[number]["icon"] }) {
  if (name === "star") return <Star className="h-[18px] w-[18px]" />;
  if (name === "shield") return <ShieldCheck className="h-[18px] w-[18px]" />;
  return <BadgeCheck className="h-[18px] w-[18px]" />;
}

export default function GriyaHero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
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
    setReduceMotion(mq.matches);
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
    <section className="relative w-full overflow-hidden bg-[#f7faf6]">
      <div
        className="group relative h-[740px] w-full overflow-hidden sm:h-[800px] lg:h-[860px]"
        aria-roledescription="carousel"
        aria-label="Banner Griya Teduh"
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
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              loading={i === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#013428]/95 via-[#013428]/50 to-transparent px-4 pb-16 pt-20 lg:px-8">
              <div className="w-full">
                <div
                  className={`max-w-2xl text-white ${
                    i === index ? "animate-fade-up" : "hidden"
                  }`}
                >
                  <div
                    className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1 shadow-sm ${slide.badgeClass}`}
                  >
                    <SlideIcon name={slide.icon} />
                    <span className="text-sm font-semibold">
                      {slide.badge}
                    </span>
                  </div>
                  <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                    {slide.title}
                  </h1>
                  <p className="mb-6 max-w-xl text-lg leading-relaxed text-[#e6e9e5]">
                    {slide.desc}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href={slide.primary.href}
                      tabIndex={i === index ? 0 : -1}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#bdeddb] px-6 text-base font-bold text-[#013428] shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {slide.icon === "shield" ? (
                        <MessageCircle className="h-5 w-5" />
                      ) : null}
                      {slide.primary.label}
                      {slide.icon !== "shield" ? (
                        <ArrowRight className="h-5 w-5" />
                      ) : null}
                    </Link>
                    {slide.secondary && (
                      <a
                        href={slide.secondary.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={i === index ? 0 : -1}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white/90 px-6 text-base font-semibold text-[#013428] shadow-sm transition-all hover:bg-white"
                      >
                        <CalendarDays className="h-5 w-5" />
                        {slide.secondary.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute left-6 top-6 z-20 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#013428] shadow backdrop-blur-md sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#013428]" />
          Suasana Asri Griya Teduh
        </div>

        <div className="absolute left-4 top-1/2 z-20 -translate-y-1/2">
          <button
            type="button"
            onClick={prev}
            aria-label="Slide sebelumnya"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#013428] shadow-lg backdrop-blur-md transition-all hover:bg-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute right-4 top-1/2 z-20 -translate-y-1/2">
          <button
            type="button"
            onClick={next}
            aria-label="Slide selanjutnya"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#013428] shadow-lg backdrop-blur-md transition-all hover:bg-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 shadow backdrop-blur-md">
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Buka slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-[#013428]" : "w-2 bg-[#c0c8c3]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
