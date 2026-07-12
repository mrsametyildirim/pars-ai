import type { Metadata } from "next";
import Link from "next/link";
import ExcelToJpgLoader from "@/components/tools/document/ExcelToJpgLoader";

export const metadata: Metadata = {
  title: "Excel → JPG — Excel Sayfasını Görsel Olarak Dışa Aktar | FormatJet",
  description: "Excel sayfalarını JPG görsel olarak dışa aktar. Tarayıcıda çalışır, ücretsiz.",
  keywords: ["excel to jpg", "excel görsel", "xlsx jpg", "excel screenshot"],
};

export default function ExcelJpgPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#3B82F6" }}>Excel → JPG</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2H6a2 2 0 0 1-2 2v12a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Excel → JPG</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Excel sayfalarını JPG görsel olarak indir. Çok sayfalı dosyalarda sayfa seçimi yapılabilir.</p>
          </div>
        </div>
        <ExcelToJpgLoader />
      </div>
    </div>
  );
}
