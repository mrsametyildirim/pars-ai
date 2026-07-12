import type { Metadata } from "next";
import Link from "next/link";
import VideoGifLoader from "@/components/tools/video/VideoGifLoader";

export const metadata: Metadata = {
  title: "Video → GIF — Ücretsiz Online Video'dan GIF Yapma | FormatJet",
  description: "MP4, MOV, AVI ve WebM videolarından GIF animasyonu oluştur. FPS ve boyut ayarı. Tarayıcıda çalışır.",
  keywords: ["video to gif", "mp4 gif", "video gif yap", "animasyon gif", "convert video gif"],
};

export default function VideoGifPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#F05A28" }}>Video → GIF</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(240,90,40,0.15)", color: "#F05A28" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 12v3a1 1 0 0 0 1 1h4m4 0h4a1 1 0 0 0 1-1v-3M4 12V9a1 1 0 0 1 1-1h4m4 0h4a1 1 0 0 1 1 1v3M4 12h16M9 8V5m6 3V5"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Video → GIF</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Videolardan döngülü GIF animasyonu oluştur. Başlangıç/bitiş zamanı ve FPS ayarı.</p>
          </div>
        </div>
        <VideoGifLoader />
      </div>
    </div>
  );
}
