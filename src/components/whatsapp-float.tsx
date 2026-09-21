import WhatsAppIcon from './whatsapp-icon'
import { WA_LINK } from './public-navbar'

export default function WhatsAppFloat() {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp pengelola"
      className="group fixed bottom-5 right-5 z-50 inline-flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-full bg-pine py-2.5 pl-3 pr-5 text-white shadow-lift transition-all duration-300 hover:bg-fern active:scale-[0.97] sm:bottom-6 sm:right-6"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300" aria-hidden />
        <WhatsAppIcon className="h-4 w-4" />
      </span>
      <span className="leading-tight">
        <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">
          Balas &lt;1 jam
        </span>
        <span className="block text-sm font-bold">0813-8463-4526</span>
      </span>
    </a>
  )
}
