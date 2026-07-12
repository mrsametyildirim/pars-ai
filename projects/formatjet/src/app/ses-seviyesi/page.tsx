import type { Metadata } from "next";
import Link from "next/link";
import AudioVolumeLoader from "@/components/tools/audio/AudioVolumeLoader";

export const metadata: Metadata = {
  title: "Ses Seviyesi Ayarla — Ücretsiz Online Ses Normalizer | FormatJet",
  description: "Ses dosyasının ses seviyesini artır veya azalt. 10–300% arasında ayarla. Tarayıcıda çalışır.",
  keywords: ["ses seviyesi ayarla", "audio volume", "ses normalize", "mp3 ses artır", "volume booster"],
};

export default function SesSeviyesiPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#10B981" }}>Ses Seviyesi Ayarla</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Ses Seviyesi Ayarla</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Ses dosyasının volume seviyesini artır, azalt veya normalize et.</p>
          </div>
        </div>
        <AudioVolumeLoader />
      </div>
    </div>
  );
}
