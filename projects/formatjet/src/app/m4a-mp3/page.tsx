import type { Metadata } from "next";
import Link from "next/link";
import { M4aToMp3Loader } from "@/components/tools/audio/AudioNewLoaders";

export const metadata: Metadata = {
  title: "M4A → MP3 Dönüştür — Ücretsiz Online Araç",
  description: "M4A ses dosyalarını MP3 formatına dönüştür. Bit hızı seçimi, FFmpeg WASM ile tarayıcıda.",
  keywords: ["m4a mp3", "m4a dönüştür", "m4a to mp3", "apple ses mp3"],
};

export default function M4aMp3Page() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#10B981" }}>M4A → MP3</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.12)", color: "#10B981" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>M4A → MP3</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>M4A ses dosyalarını MP3&apos;e dönüştür. Bit hızı seçimi, tüm işlem tarayıcıda.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz · FFmpeg WASM</span>
          <button className="font-medium hover:underline" style={{ color: "#10B981" }}>Pro&apos;ya geç →</button>
        </div>
        <M4aToMp3Loader />
      </div>
    </div>
  );
}
