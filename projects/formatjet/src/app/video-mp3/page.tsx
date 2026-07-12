import type { Metadata } from "next";
import Link from "next/link";
import VideoToMp3Loader from "@/components/tools/video/VideoToMp3Loader";

export const metadata: Metadata = {
  title: "Video → MP3 — Ücretsiz Online Video'dan Ses Çıkarma | FormatJet",
  description: "Video dosyasından MP3, WAV veya AAC ses dosyası çıkar. MP4, MOV, AVI, MKV, WebM destekli. Tarayıcıda çalışır.",
  keywords: ["video to mp3", "video mp3", "ses çıkar", "mp4 mp3", "video ses"],
};

export default function VideoMp3Page() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#F05A28" }}>Video → MP3</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(240,90,40,0.15)", color: "#F05A28" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Video → MP3</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>MP4, MOV, AVI ve MKV videolarından yüksek kaliteli MP3 çıkar.</p>
          </div>
        </div>
        <VideoToMp3Loader />
      </div>
    </div>
  );
}
