import type { Metadata } from "next";
import Link from "next/link";
import VideoConvertLoader from "@/components/tools/video/VideoConvertLoader";

export const metadata: Metadata = {
  title: "Video Sıkıştır — Ücretsiz Online Video Boyutu Küçültme | FormatJet",
  description: "Video dosyasının boyutunu kaliteyi koruyarak küçült. Tarayıcıda çalışır.",
  keywords: ["video sıkıştır", "compress video", "video boyutu küçült", "mp4 compress", "video küçült"],
};

export default function VideoSikistirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#F05A28" }}>Video Sıkıştır</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(240,90,40,0.15)", color: "#F05A28" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
              <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Video Sıkıştır</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Video boyutunu kaliteyi koruyarak küçült. WhatsApp, email ve sosyal medya için ideal.</p>
          </div>
        </div>
        <VideoConvertLoader inputFormats={["mp4", "mov", "avi", "webm"]} outputFormat="mp4" accentColor="#F05A28" />
      </div>
    </div>
  );
}
