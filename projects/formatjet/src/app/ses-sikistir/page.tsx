import type { Metadata } from "next";
import Link from "next/link";
import AudioConvertLoader from "@/components/tools/audio/AudioConvertLoader";

export const metadata: Metadata = {
  title: "Ses Sıkıştır — Ücretsiz Online Ses Boyutu Küçültme | FormatJet",
  description: "Ses dosyasının boyutunu kaliteyi koruyarak küçült. MP3 sıkıştırma. Tarayıcıda çalışır.",
  keywords: ["ses sıkıştır", "compress audio", "mp3 boyut küçült", "audio compress"],
};

export default function SesSikistirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#10B981" }}>Ses Sıkıştır</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
              <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Ses Sıkıştır</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Ses dosyasının boyutunu dinleme kalitesini koruyarak düşür.</p>
          </div>
        </div>
        <AudioConvertLoader inputFormats={["mp3", "wav", "flac", "aac", "m4a"]} outputFormat="mp3" accentColor="#10B981" />
      </div>
    </div>
  );
}
