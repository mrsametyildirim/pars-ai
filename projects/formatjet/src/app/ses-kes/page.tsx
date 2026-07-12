import type { Metadata } from "next";
import Link from "next/link";
import AudioTrimLoader from "@/components/tools/audio/AudioTrimLoader";

export const metadata: Metadata = {
  title: "Ses Kes — Ücretsiz Online Ses Kırpma | FormatJet",
  description: "Ses dosyasından belirli bir bölümü kes ve kaydet. MP3, WAV destekli. Tarayıcıda çalışır.",
  keywords: ["ses kes", "audio trim", "ses kırp", "mp3 kes", "trim audio"],
};

export default function SesKesPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#10B981" }}>Ses Kes</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
              <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Ses Kes</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Ses dosyasından başlangıç ve bitiş zamanı belirleyerek bölüm kes.</p>
          </div>
        </div>
        <AudioTrimLoader />
      </div>
    </div>
  );
}
