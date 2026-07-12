import type { Metadata } from "next";
import Link from "next/link";
import { PdfGrayscaleLoader } from "@/components/tools/pdf/PdfEditLoaders";

export const metadata: Metadata = {
  title: "PDF Gri Tona Çevir — Ücretsiz Online Araç",
  description: "Renkli PDF'i gri tona dönüştür. Yazdırma maliyetini düşür, her sayfa görsel olarak işlenir.",
  keywords: ["pdf gri ton", "pdf siyah beyaz", "pdf grayscale", "pdf baskı tasarruf"],
};

export default function PdfGriPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF Gri Tona Çevir</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.12)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF Gri Tona Çevir</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Renkli PDF dosyasını siyah-beyaz gri tona dönüştür. Baskı maliyetini azalt.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz · Sayfa başına render + dönüşüm</span>
          <button className="font-medium hover:underline" style={{ color: "#E84545" }}>Pro&apos;ya geç →</button>
        </div>
        <PdfGrayscaleLoader />
      </div>
    </div>
  );
}
