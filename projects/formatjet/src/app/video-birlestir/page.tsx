import type { Metadata } from "next";
import Link from "next/link";
import VideoConcatLoader from "@/components/tools/video/VideoConcatLoader";

export const metadata: Metadata = {
  title: "Video Birleştir — Ücretsiz Online Video Birleştirme | FormatJet",
  description: "Birden fazla video dosyasını sırayla birleştir ve tek MP4 yap. Tarayıcıda çalışır.",
  keywords: ["video birleştir", "merge video", "join video", "video birleştirme", "combine video"],
};

export default function VideoBirlestirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#F05A28" }}>Video Birleştir</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(240,90,40,0.15)", color: "#F05A28" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 6h6v12H3zM15 6h6v12h-6zM9 12h6"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Video Birleştir</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Birden fazla video klibini sırayla birleştir ve tek dosya oluştur.</p>
          </div>
        </div>
        <VideoConcatLoader />
      </div>
    </div>
  );
}
