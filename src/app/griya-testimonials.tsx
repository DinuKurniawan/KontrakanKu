"use client";

import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    text: "\u201CSudah 2 tahun kami sekeluarga tinggal di Tipe Rumah Keluarga. Pak Rahman sangat ramah dan tanggap. Waktu ada kendala kran air macet, belum sampai 1 jam langsung dibantu ganti baru. Anak-anak juga betah karena suasananya tenang.\u201D",
    name: "Mas Dimas & Mbak Rina",
    unit: "Penghuni Tipe Rumah • 2 Tahun",
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDl8pudJquteyqYrTFff7YoDhw6V6YS4GphPoFejxnnFCifY7_QmX2Q8gxgglYFC6G7Xjtoy0tvRniX4K30-n7G2j3s3ADRduIbLdUtq8w8X_kvKKVL1LVvUXaXC-gw2yWHdMeNTB3i4vPF9fAKsvbE8W2y50DyycEbeMAe5xuDKTbhrZAAbUX9-Fkie1jxGz1kWRVswtYkpeieDsfvcVOOH6zftEVsW8yV78J9oP4",
  },
  {
    text: "\u201CSebagai karyawan yang sering pulang malam naik KRL, lokasi Griya Teduh juara banget. Dari stasiun tinggal 5 menitan, masuk gang portalnya aman dan terang. Bu Siti juga sering ngirim camilan kalau lagi masak besar. Serasa punya keluarga sendiri.\u201D",
    name: "Annisa Wardani",
    unit: "Penghuni Paviliun Asri • 1,5 Tahun",
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwCRzkzpZHqnH42BmxQKOw2O-RAxrHy3jKDykHm21WZMG41XkteakzdyEQmJmtUQIsGs7BcQldInUi3QEnNg72qCk_Sp34VI4KD6PGoqSw-GM4ydru7B-cxi7x6NSESoaA-6yzIRmZJa8dn23I2UMH5_7Hcy614g8QpAQhue2pIIZZl6WKIlmGcSHU1ZoDz15-_NZNTf6u0c8_UgqWDPDR4W2LJGliPE5Cc_lg9MI",
  },
  {
    text: "\u201CAirnya jernih banget, nggak pernah bau besi sama sekali. Listrik token sendiri jadi transparan dan bisa hemat sesuai pemakaian. Lingkungannya bersih karena ada petugas kebersihan area bersama 2 hari sekali. Sangat rekomen!\u201D",
    name: "Fajar Hidayat",
    unit: "Penghuni Studio Hemat • 10 Bulan",
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHclWW0_L3tt5zVGgKGbzhT2tuo47L7TnPdOo9osRb3MsGOUqJVZJcWS_QNggXRtuuckUJaAQCimXg97OdfE3_BFggO62Mpoc0zqBXa8apOYFV3-7FeHJTRCdfgWw_D8r_UxdBUzOD-II_bCKVJscjdAz3rlIzZGeI007vnJ__DAm67wM684qlGGHoTxb4dL_EvAZYWAaofxgjpR6UWt0w0j9UFaA65nmBiwE7M50",
  },
];

function TestimonialCard({
  t,
  hidden,
}: {
  t: (typeof TESTIMONIALS)[number];
  hidden?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden}
      className="relative flex w-[320px] shrink-0 flex-col rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:w-[420px]"
    >
      <Quote className="absolute right-6 top-6 h-10 w-10 text-[#974723]/30" />
      <div className="mb-3 flex items-center gap-1 text-[#974723]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-[18px] w-[18px] fill-current" />
        ))}
      </div>
      <p className="mb-6 flex-1 leading-relaxed text-[#181c1b]">{t.text}</p>
      <div className="flex items-center gap-3 pt-3">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#e6e9e5]">
          <img
            src={t.photo}
            alt={hidden ? "" : t.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[#013428]">{t.name}</span>
          <span className="text-xs text-[#404945]">{t.unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function GriyaTestimonials() {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div
      className="testimonial-marquee-paused relative w-full overflow-hidden"
      aria-label="Testimoni penghuni berjalan"
    >
      <div className="animate-testimonial-marquee flex w-max gap-6 pr-6">
        {loop.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} hidden={i >= TESTIMONIALS.length} />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#f7faf6] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#f7faf6] to-transparent"
        aria-hidden
      />
    </div>
  );
}
