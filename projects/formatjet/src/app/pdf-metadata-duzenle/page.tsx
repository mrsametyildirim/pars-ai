import type { Metadata } from "next";
import Link from "next/link";
import { PdfMetadataLoader } from "@/components/tools/pdf/PdfEditLoaders";

export const metadata: Metadata = {
  title: "PDF Meta Veri Düzenle — Başlık Yazar Konu",
  description: "PDF meta verilerini düzenle: başlık, yazar, konu, anahtar kelimeler. Mevcut meta veriler otomatik yüklenir.",
  keywords: ["pdf meta veri", "pdf başlık değiştir", "pdf yazar", "pdf properties", "pdf metadata"],
};

export default function PdfMetadataDuzenlePage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF Meta Veri Düzenle</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.12)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF Meta Veri Düzenle</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>PDF başlık, yazar, konu ve anahtar kelimelerini düzenle. Mevcut meta veriler otomatik yüklenir.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz · Mevcut değerler yüklenir</span>
          <button className="font-medium hover:underline" style={{ color: "#E84545" }}>Pro&apos;ya geç →</button>
        </div>
        <PdfMetadataLoader />
      </div>
    </div>
  );
}
