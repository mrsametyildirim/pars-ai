import type { Metadata } from "next";
import Link from "next/link";
import { ExcelToCsvLoader } from "@/components/tools/document/ExcelCsvLoader";

export const metadata: Metadata = {
  title: "Excel → CSV — Ücretsiz Online Excel'den CSV Dönüştürme | FormatJet",
  description: "Excel tablosunu CSV formatına dönüştür. Birden fazla sekme desteği. Tarayıcıda çalışır.",
  keywords: ["excel to csv", "excel csv", "xlsx csv", "tablo csv"],
};

export default function ExcelCsvPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#3B82F6" }}>Excel → CSV</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2h-2a2 2 0 0 1-2 2"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Excel → CSV</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Excel tablosunu virgülle ayrılmış CSV formatına dönüştür. Tarayıcıda çalışır.</p>
          </div>
        </div>
        <ExcelToCsvLoader />
      </div>
    </div>
  );
}
