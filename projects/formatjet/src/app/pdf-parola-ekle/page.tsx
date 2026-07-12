import type { Metadata } from "next";
import Link from "next/link";
import { PdfAddPasswordLoader } from "@/components/tools/pdf/PdfPasswordLoader";

export const metadata: Metadata = {
  title: "PDF Parola Ekle — Ücretsiz Online PDF Şifreleme | FormatJet",
  description: "PDF'e parola ekle ve şifrele. Kopyalama ve düzenleme izinlerini kısıtla. Tarayıcında çalışır.",
  keywords: ["pdf parola ekle", "pdf şifre ekle", "protect pdf", "pdf şifrele", "pdf lock"],
};

export default function PdfParolaEklePage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF Parola Ekle</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF Parola Ekle</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              PDF dosyana parola koy. Kopyalama ve düzenleme izinleri otomatik kısıtlanır.
            </p>
          </div>
        </div>

        {/* Güvenlik uyarısı */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border mb-6"
          style={{ borderColor: "rgba(232,69,69,0.3)", background: "rgba(232,69,69,0.06)" }}>
          <span className="text-base mt-0.5">🔒</span>
          <p className="text-xs" style={{ color: "var(--color-text-2)" }}>
            Şifreleme tarayıcında gerçekleşir. PDF dosyan hiçbir sunucuya gönderilmez. Parolanı güvenli bir yerde sakla — kurtarma imkânı yoktur.
          </p>
        </div>

        <PdfAddPasswordLoader />
      </div>
    </div>
  );
}
