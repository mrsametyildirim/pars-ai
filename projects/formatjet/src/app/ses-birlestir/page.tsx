import type { Metadata } from "next";
import Link from "next/link";
import AudioConcatLoader from "@/components/tools/audio/AudioConcatLoader";

export const metadata: Metadata = {
  title: "Ses Birleştir — Ücretsiz Online Ses Dosyası Birleştirme | FormatJet",
  description: "Birden fazla ses dosyasını sırayla birleştir ve tek MP3 yap. Tarayıcıda çalışır.",
  keywords: ["ses birleştir", "merge audio", "join audio", "mp3 birleştir", "combine audio"],
};

export default function SesBirlestirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#10B981" }}>Ses Birleştir</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              <path d="M3 12h18M12 6v12"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Ses Birleştir</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Birden fazla MP3 veya WAV dosyasını sırayla birleştir.</p>
          </div>
        </div>
        <AudioConcatLoader />
      </div>
    </div>
  );
}
