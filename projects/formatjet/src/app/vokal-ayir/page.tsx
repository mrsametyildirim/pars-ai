import type { Metadata } from "next";
import Link from "next/link";
import VocalSeparatorLoader from "@/components/tools/audio/VocalSeparatorLoader";

export const metadata: Metadata = {
  title: "Vokal Ayır — Ücretsiz Online Ses & Vokal Ayırma | FormatJet",
  description: "Yapay zeka ile şarkıdan vokal ve enstrümantal parçaları ayır. Karaoke yapımı. Yakında aktif.",
  keywords: ["vokal ayır", "vocal remover", "karaoke", "stems ayır", "ses vokal ayır", "instrumental"],
};

export default function VokalAyirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#10B981" }}>Vokal Ayır</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-2xl font-medium" style={{ color: "var(--color-text)" }}>Vokal Ayır</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>YZ</span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Şarkıdan vokal ve enstrümantal parçaları yapay zeka ile ayır. Karaoke versiyonu oluştur.</p>
          </div>
        </div>
        <VocalSeparatorLoader />
      </div>
    </div>
  );
}
