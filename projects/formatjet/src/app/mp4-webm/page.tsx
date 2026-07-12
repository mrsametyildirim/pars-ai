import type { Metadata } from "next";
import Link from "next/link";
import { Mp4ToWebmLoader } from "@/components/tools/video/VideoNewLoaders";

export const metadata: Metadata = {
  title: "MP4 → WebM Dönüştür — Ücretsiz Online Araç",
  description: "MP4 video dosyalarını WebM formatına dönüştür. Web uyumlu format, tarayıcıda çalışır.",
  keywords: ["mp4 webm", "mp4 dönüştür webm", "mp4 to webm", "webm format"],
};

export default function Mp4WebmPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#F05A28" }}>MP4 → WebM</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(240,90,40,0.12)", color: "#F05A28" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>MP4 → WebM</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>MP4 videolarını web uyumlu WebM formatına dönüştür. Kalite ayarı destekli.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz · FFmpeg WASM</span>
          <button className="font-medium hover:underline" style={{ color: "#F05A28" }}>Pro&apos;ya geç →</button>
        </div>
        <Mp4ToWebmLoader />
      </div>
    </div>
  );
}
