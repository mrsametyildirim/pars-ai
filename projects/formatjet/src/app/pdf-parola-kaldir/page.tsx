import type { Metadata } from "next";
import Link from "next/link";
import { PdfRemovePasswordLoader } from "@/components/tools/pdf/PdfPasswordLoader";

export const metadata: Metadata = {
  title: "PDF Parola Kaldır — Ücretsiz Online PDF Kilit Açma | FormatJet",
  description: "Bilinen parola ile PDF şifresini kaldır. Kısıtlamaları temizle ve PDF'i özgürce kullan. Tarayıcında çalışır.",
  keywords: ["pdf parola kaldır", "pdf şifre kaldır", "unlock pdf", "pdf kilidi aç", "remove pdf password"],
};

export default function PdfParolaKaldirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#F05A28" }}>PDF Parola Kaldır</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(240,90,40,0.15)", color: "#F05A28" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M8 11V7a4 4 0 1 1 8 0m-4 8v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF Parola Kaldır</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Bildiğin parola ile şifreli PDF'in kilidini aç. Parola kaldırılmış PDF indirilir.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border mb-6"
          style={{ borderColor: "rgba(240,90,40,0.3)", background: "rgba(240,90,40,0.06)" }}>
          <span className="text-base mt-0.5">ℹ️</span>
          <p className="text-xs" style={{ color: "var(--color-text-2)" }}>
            Bu araç yalnızca parolasını bildiğin PDF dosyaları içindir. Brute-force veya parola kırma yapılmaz.
          </p>
        </div>

        <PdfRemovePasswordLoader />
      </div>
    </div>
  );
}
