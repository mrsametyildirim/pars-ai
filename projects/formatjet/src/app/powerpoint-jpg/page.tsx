import type { Metadata } from "next";
import Link from "next/link";
import PptxToJpgLoader from "@/components/tools/document/PptxToJpgLoader";

export const metadata: Metadata = {
  title: "PowerPoint → JPG — Ücretsiz Online Slayttan Görsel Dönüştürme | FormatJet",
  description: "PowerPoint slaytlarını yüksek kaliteli JPG görsel olarak dışa aktar. Yakında aktif.",
  keywords: ["ppt to jpg", "powerpoint görsel", "slayt jpg", "pptx jpg"],
};

export default function PowerpointJpgPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#3B82F6" }}>PowerPoint → JPG</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PowerPoint → JPG</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>PowerPoint slaytlarını yüksek çözünürlüklü JPG olarak indir.</p>
          </div>
        </div>
        <PptxToJpgLoader />
      </div>
    </div>
  );
}
