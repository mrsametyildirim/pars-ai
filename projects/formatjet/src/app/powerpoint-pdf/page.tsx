import type { Metadata } from "next";
import Link from "next/link";
import PptxToPdfLoader from "@/components/tools/document/PptxToPdfLoader";

export const metadata: Metadata = {
  title: "PowerPoint → PDF — Ücretsiz Online Sunu'dan PDF Dönüştürme | FormatJet",
  description: "PowerPoint sunumunu PDF'e dönüştür. Yakında aktif.",
  keywords: ["powerpoint to pdf", "ppt pdf", "pptx pdf", "sunu pdf"],
};

export default function PowerpointPdfPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PowerPoint → PDF</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PowerPoint → PDF</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>PPT/PPTX sunumunu PDF formatına dönüştür.</p>
          </div>
        </div>
        <PptxToPdfLoader />
      </div>
    </div>
  );
}
