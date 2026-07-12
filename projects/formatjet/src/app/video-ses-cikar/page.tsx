import type { Metadata } from "next";
import Link from "next/link";
import VideoToMp3Loader from "@/components/tools/video/VideoToMp3Loader";

export const metadata: Metadata = {
  title: "Videodan Ses Çıkar — Ücretsiz Online Video Ses Ayırma | FormatJet",
  description: "Videodan ses parçasını ayırarak MP3, WAV veya AAC olarak kaydet. Tarayıcıda çalışır.",
  keywords: ["videodan ses çıkar", "extract audio from video", "video ses ayır", "mp4 ses çıkar"],
};

export default function VideoSesCikarPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#F05A28" }}>Videodan Ses Çıkar</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(240,90,40,0.15)", color: "#F05A28" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Videodan Ses Çıkar</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Video dosyasındaki ses parçasını ayır ve MP3 veya WAV olarak indir.</p>
          </div>
        </div>
        <VideoToMp3Loader />
      </div>
    </div>
  );
}
