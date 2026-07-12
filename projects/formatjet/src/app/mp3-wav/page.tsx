import type { Metadata } from "next";
import Link from "next/link";
import AudioConvertLoader from "@/components/tools/audio/AudioConvertLoader";

export const metadata: Metadata = {
  title: "MP3 → WAV — Ücretsiz Online MP3'ten WAV Dönüştürme | FormatJet",
  description: "MP3 ses dosyasını kayıpsız WAV formatına dönüştür. Stüdyo kalitesi. Tarayıcıda çalışır.",
  keywords: ["mp3 to wav", "mp3 wav", "convert mp3 wav", "mp3 dönüştür wav"],
};

export default function Mp3WavPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#10B981" }}>MP3 → WAV</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>MP3 → WAV</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>MP3 dosyasını stüdyo uyumlu WAV formatına dönüştür.</p>
          </div>
        </div>
        <AudioConvertLoader inputFormats={["mp3"]} outputFormat="wav" accentColor="#10B981" />
      </div>
    </div>
  );
}
