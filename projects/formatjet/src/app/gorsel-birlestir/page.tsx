import type { Metadata } from "next";
import Link from "next/link";
import ImageMergeLoader from "@/components/tools/image/ImageMergeLoader";

export const metadata: Metadata = {
  title: "Görsel Birleştir — Ücretsiz Online Resim Birleştirme | FormatJet",
  description: "Birden fazla görseli yan yana, üst üste veya grid düzeninde birleştir. Tarayıcında çalışır, yükleme gerekmez.",
  keywords: ["görsel birleştir", "resim birleştir", "merge images", "combine images", "fotoğraf birleştir"],
};

export default function GoruselBirlestirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>Görsel Birleştir</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm10 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6zM4 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Görsel Birleştir</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Görselleri yatay, dikey veya 2-kolon düzeninde birleştir. Sırayı sürükle-bırak ile değiştir.
            </p>
          </div>
        </div>
        <ImageMergeLoader />
        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>Görsel Birleştirme Hakkında</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "Kaç görsel birleştirebilirim?", a: "Ücretsiz planda en fazla 10 görsel birleştirilebilir. Pro'da sınır kaldırılır." },
              { q: "Düzenleme seçenekleri neler?", a: "Yatay (yan yana), dikey (üst üste) ve 2-kolon grid düzeni. Her modda özel boşluk ve arka plan rengi ayarlanabilir." },
              { q: "Görsel sırası nasıl değiştirilir?", a: "Listedeki ok butonlarını kullan. Birleştirmeden önce sıra doğrudan belirler." },
              { q: "Boyutlar nasıl hesaplanır?", a: "Yatay modda en yüksek görselin yüksekliği referans alınır. Diğer görseller bu yüksekliğe orantısal ölçeklenir." },
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
