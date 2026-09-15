import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from "@/components/toast-provider";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

const instrument = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kelola Kontrakan — Hunian Tertata di Cilandak",
  description:
    "Kontrakan keluarga di Cilandak — tagihan transparan, fasilitas terawat, pengelola yang bisa dihubungi langsung. Kelola tagihan & bukti transfer tanpa ribet.",
  openGraph: {
    title: "Kelola Kontrakan — Hunian Tertata di Cilandak",
    description:
      "Kontrakan keluarga di Cilandak — tagihan transparan, fasilitas terawat, pengelola yang bisa dihubungi langsung.",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kelola Kontrakan — Hunian Tertata di Cilandak",
    description:
      "Kontrakan keluarga di Cilandak — tagihan transparan, fasilitas terawat.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1F33",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrument.variable} ${mono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
        <ToastProvider />
        <Script
          id="bis-attr-blocker"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  function isBlocked(name) {
                    return (
                      typeof name === 'string' &&
                      (name === 'bis_skin_checked' ||
                        name.indexOf('bis_') === 0 ||
                        name.indexOf('__processed_') === 0)
                    );
                  }
                  function stripNode(el) {
                    if (!el || el.nodeType !== 1) return;
                    try {
                      var attrs = el.attributes;
                      if (!attrs) return;
                      var toRemove = [];
                      for (var i = 0; i < attrs.length; i++) {
                        if (isBlocked(attrs[i].name)) toRemove.push(attrs[i].name);
                      }
                      for (var j = 0; j < toRemove.length; j++) {
                        try { el.removeAttribute(toRemove[j]); } catch (e) {}
                      }
                    } catch (e) {}
                  }
                  function stripTree(root) {
                    try {
                      if (!root) return;
                      if (root.nodeType === 1) {
                        stripNode(root);
                        var list = root.querySelectorAll
                          ? root.querySelectorAll('[bis_skin_checked]')
                          : [];
                        for (var k = 0; k < list.length; k++) stripNode(list[k]);
                      }
                    } catch (e) {}
                  }
                  try {
                    var origSet = Element.prototype.setAttribute;
                    Element.prototype.setAttribute = function (name, value) {
                      if (isBlocked(name)) return;
                      return origSet.apply(this, arguments);
                    };
                  } catch (e) {}
                  try {
                    if (Element.prototype.setAttributeNode) {
                      var origSetNode = Element.prototype.setAttributeNode;
                      Element.prototype.setAttributeNode = function (attr) {
                        try {
                          if (attr && isBlocked(attr.name)) return attr;
                        } catch (e) {}
                        return origSetNode.apply(this, arguments);
                      };
                    }
                  } catch (e) {}
                  try {
                    if (Element.prototype.toggleAttribute) {
                      var origToggle = Element.prototype.toggleAttribute;
                      Element.prototype.toggleAttribute = function (name, force) {
                        if (isBlocked(name)) return false;
                        return origToggle.apply(this, arguments);
                      };
                    }
                  } catch (e) {}
                  stripTree(document.documentElement);
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', function () {
                      stripTree(document.documentElement);
                    });
                  }
                  if (typeof MutationObserver !== 'undefined' && document.documentElement) {
                    var observer = new MutationObserver(function (mutations) {
                      for (var m = 0; m < mutations.length; m++) {
                        var mu = mutations[m];
                        if (mu.type === 'attributes') {
                          if (isBlocked(mu.attributeName)) {
                            try { mu.target.removeAttribute(mu.attributeName); } catch (e) {}
                          }
                        } else if (mu.type === 'childList') {
                          try {
                            var added = mu.addedNodes;
                            for (var n = 0; n < added.length; n++) stripTree(added[n]);
                          } catch (e) {}
                        }
                      }
                    });
                    observer.observe(document.documentElement, {
                      attributes: true,
                      childList: true,
                      subtree: true,
                    });
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
