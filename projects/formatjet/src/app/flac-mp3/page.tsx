import type { Metadata } from "next";
import Link from "next/link";
import AudioConvertLoader from "@/components/tools/audio/AudioConvertLoader";

export const metadata: Metadata = {
  title: "FLAC → MP3 — Ücretsiz Online FLAC'tan MP3 Dönüştürme | FormatJet",
  description: "FLAC kayıpsız ses dosyasını MP3'e dönüştür. Taşınabilir cihazlarla uyumlu. Tarayıcıda çalışır.",
  keywords: ["flac to mp3", "flac mp3", "convert flac mp3", "flac dönüştür"],
};

export default function FlacMp3Page() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#10B981" }}>FLAC → MP3</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>FLAC → MP3</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Kayıpsız FLAC dosyalarını geniş uyumlu MP3 formatına dönüştür.</p>
          </div>
        </div>
        <AudioConvertLoader inputFormats={["flac"]} outputFormat="mp3" accentColor="#10B981" />
      </div>
    </div>
  );
}
