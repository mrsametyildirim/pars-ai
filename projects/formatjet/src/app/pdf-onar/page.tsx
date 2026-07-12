import type { Metadata } from "next";
import Link from "next/link";
import { PdfRepairLoader } from "@/components/tools/pdf/PdfEditLoaders";

export const metadata: Metadata = {
  title: "PDF Onar — Hasarlı PDF Düzeltme Aracı",
  description: "Bozuk veya hasarlı PDF dosyalarını onar. xref hataları, eksik nesneler ve truncate sorunları çözülür.",
  keywords: ["pdf onar", "pdf repair", "pdf düzelt", "hasarlı pdf", "bozuk pdf aç"],
};

export default function PdfOnarPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF Onar</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.12)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF Onar</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Hasarlı veya bozuk PDF dosyalarını onar. xref hataları ve yapısal sorunlar giderilir.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz · Tarayıcıda çalışır</span>
          <button className="font-medium hover:underline" style={{ color: "#E84545" }}>Pro&apos;ya geç →</button>
        </div>
        <PdfRepairLoader />
      </div>
    </div>
  );
}
