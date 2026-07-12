import type { Metadata } from "next";
import Link from "next/link";
import { CsvToExcelLoader } from "@/components/tools/document/ExcelCsvLoader";

export const metadata: Metadata = {
  title: "CSV → Excel — Ücretsiz Online CSV'den Excel Dönüştürme | FormatJet",
  description: "CSV dosyasını Excel tablosuna (.xlsx) dönüştür. Tarayıcıda çalışır, sunucuya gönderilmez.",
  keywords: ["csv to excel", "csv excel", "csv xlsx"],
};

export default function CsvExcelPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#3B82F6" }}>CSV → Excel</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2h-2a2 2 0 0 1-2 2"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>CSV → Excel</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>CSV dosyasını Excel tablosuna (.xlsx) dönüştür. Tarayıcıda çalışır.</p>
          </div>
        </div>
        <CsvToExcelLoader />
      </div>
    </div>
  );
}
