import type { Metadata } from "next";
import Link from "next/link";
import PdfSplitLoader from "@/components/tools/pdf/PdfSplitLoader";

export const metadata: Metadata = {
  title: "PDF Böl — Ücretsiz Online PDF Bölme Aracı",
  description:
    "PDF'i sayfalara, aralıklara veya her N sayfada bir böl. Tarayıcıda çalışır, sunucuya yükleme gerekmez.",
  keywords: ["pdf böl", "pdf split", "pdf parçala", "split pdf online", "pdf sayfa ayır"],
};

export default function PdfBolPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">

        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF Böl</span>
        </nav>

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF Böl</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Her sayfayı ayrı böl, belirli sayfaları seç veya her N sayfada bir parçala.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz: sınırsız sayfa</span>
          <button className="font-medium hover:underline" style={{ color: "#E84545" }}>Pro&apos;ya geç →</button>
        </div>

        <PdfSplitLoader />

        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>PDF Bölme Hakkında</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "Her Sayfayı Ayır ne yapar?", a: "PDF'deki her sayfa ayrı bir PDF dosyası olarak çıkarılır. 10 sayfalı PDF → 10 ayrı PDF." },
              { q: "Sayfa Seç modu nasıl çalışır?", a: "Virgülle ayrılmış sayfa numaraları veya aralıklar girerek istediğin sayfaları tek PDF'de topla. Örn: 1,3,5-8,12" },
              { q: "N Sayfada Böl ne işe yarar?", a: "PDF'i eşit parçalara böler. 30 sayfalık PDF'i 10'ar sayfaya bölmek için N=10 gir, 3 PDF çıkar." },
              { q: "Şifreli PDF bölünebilir mi?", a: "Hayır. Şifreli PDF'ler için önce 'PDF Parola Kaldır' aracını kullanın." },
            ].map(item => (
              <div key={item.q} className="p-4 rounded-lg border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>{item.q}</h3>
                <p className="text-sm" style={{ color: "var(--color-text-2)" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
