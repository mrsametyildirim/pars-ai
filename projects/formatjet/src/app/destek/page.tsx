"use client";

import Link from "next/link";
import { useState } from "react";

type StageId = 1 | 2 | 3 | 4;

const STAGES: {
  id: StageId;
  goalTry: string;
  goalEur: string;
  label: string;
  limits: { label: string; free: string; boosted: string }[];
}[] = [
  {
    id: 1,
    goalTry: "₺56.650",
    goalEur: "€515 / ay",
    label: "Temel Sürdürülebilirlik",
    limits: [
      { label: "Standart işlem", free: "10 / gün", boosted: "15 / gün" },
      { label: "PDF",            free: "10 MB",    boosted: "20 MB" },
      { label: "Görsel",         free: "25 MB",    boosted: "40 MB" },
      { label: "Toplu işlem",    free: "—",        boosted: "3 dosya" },
    ],
  },
  {
    id: 2,
    goalTry: "₺655.600",
    goalEur: "€5.960 / ay",
    label: "Sunucu Genişletme",
    limits: [
      { label: "Standart işlem", free: "10 / gün", boosted: "25 / gün" },
      { label: "PDF",            free: "10 MB",    boosted: "35 MB" },
      { label: "Görsel",         free: "25 MB",    boosted: "60 MB" },
      { label: "Toplu işlem",    free: "—",        boosted: "8 dosya" },
    ],
  },
  {
    id: 3,
    goalTry: "₺2.535.500",
    goalEur: "€23.050 / ay",
    label: "OCR ve Video Kapasitesi",
    limits: [
      { label: "Standart işlem", free: "10 / gün", boosted: "40 / gün" },
      { label: "PDF",            free: "10 MB",    boosted: "60 MB" },
      { label: "Görsel",         free: "25 MB",    boosted: "100 MB" },
      { label: "Toplu işlem",    free: "—",        boosted: "15 dosya" },
    ],
  },
  {
    id: 4,
    goalTry: "₺8.220.850",
    goalEur: "€74.735 / ay",
    label: "Tam Kapasite",
    limits: [
      { label: "Standart işlem", free: "10 / gün", boosted: "Sınırsız" },
      { label: "PDF",            free: "10 MB",    boosted: "100 MB" },
      { label: "Görsel",         free: "25 MB",    boosted: "200 MB" },
      { label: "Toplu işlem",    free: "—",        boosted: "30 dosya" },
    ],
  },
];

const STAT_CARDS = [
  { label: "Üyelik geliri",       value: "₺142.800",  icon: "M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6M12 2v13m0 0-4-4m4 4 4-4" },
  { label: "Jet kredileri",       value: "₺38.250",   icon: "M13 2 3 14h7v8l10-12h-7z" },
  { label: "Topluluk desteği",    value: "₺21.400",   icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" },
  { label: "1. etap hedefi",      value: "₺56.650",   icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

const MINI_CARDS = [
  { title: "Pro'ya Geç",           desc: "Reklamsız, yüksek limitli deneyim.",         href: "/pro" },
  { title: "Jet Limitini Artır",   desc: "Toplu işlem için kredi satın al.",           href: "/jet-limit" },
  { title: "Destek Ol",            desc: "Tek seferlik katkıyla topluluğu büyüt.",     href: "#destek-miktar" },
];

const FUND_USAGE = [
  { label: "Sunucu ve altyapı",   pct: 42, color: "#2563EB" },
  { label: "Geliştirme",          pct: 26, color: "#059669" },
  { label: "OCR / AI işlemleri",  pct: 18, color: "#F05A28" },
  { label: "Destek ve moderasyon", pct: 9,  color: "#7C3AED" },
  { label: "Diğer",               pct: 5,  color: "#9CA3AF" },
];

const AMOUNTS = ["₺100", "₺250", "₺500", "₺1.000"];

export default function DestekPage() {
  const [stage, setStage] = useState<StageId>(2);
  const [amount, setAmount] = useState<string>("₺250");
  const [customAmount, setCustomAmount] = useState("");

  const activeStage = STAGES.find(s => s.id === stage)!;

  function selectAmount(a: string) {
    setAmount(a);
    setCustomAmount("");
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="pt-14 pb-12 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="container">
          <div className="grid md:grid-cols-5 gap-10 items-center">
            {/* 3 birim: metin */}
            <div className="md:col-span-3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{ color: "var(--color-accent)", background: "var(--color-accent-muted)" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Topluluk Kampanyası
              </span>
              <h1 style={{
                fontSize: "clamp(2rem,4.2vw,2.7rem)",
                fontWeight: 800,
                color: "var(--color-text)",
                letterSpacing: "-0.5px",
                lineHeight: 1.15,
                marginBottom: "16px",
              }}>
                Ücretsiz araçları <span style={{ color: "var(--color-accent)" }}>birlikte büyütelim.</span>
              </h1>
              <p style={{ fontSize: "16px", color: "var(--color-text-2)", lineHeight: 1.65, marginBottom: "24px", maxWidth: "540px" }}>
                FormatJet, milyonlarca kullanıcıya ücretsiz hizmet veriyor. Desteğin sunucu, geliştirme ve OCR kapasitesini büyütür — limitler herkes için yükselir.
              </p>
              <a
                href="#destek-miktar"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-white"
                style={{ background: "var(--color-accent)" }}
              >
                Destek Ol
              </a>
            </div>

            {/* 2 birim: istatistik kartı */}
            <div className="md:col-span-2">
              <div className="rounded-2xl border p-5" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <div className="grid grid-cols-2 gap-4">
                  {STAT_CARDS.map(stat => (
                    <div key={stat.label} className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5" style={{ background: "var(--color-accent-muted)" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d={stat.icon} />
                        </svg>
                      </div>
                      <div className="text-base font-bold" style={{ color: "var(--color-text)" }}>{stat.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mini kartlar */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MINI_CARDS.map(card => (
              <Link
                key={card.title}
                href={card.href}
                className="flex flex-col gap-1.5 rounded-2xl border px-5 py-5 transition-colors"
                style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{card.title}</span>
                <span className="text-xs" style={{ color: "var(--color-text-2)" }}>{card.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Etap kartları */}
      <section className="py-12 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="container">
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>Kampanya Etapları</h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-2)" }}>
            Bir etap seç, o etapta ücretsiz kullanıcıların erişeceği limitleri gör.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {STAGES.map(s => {
              const isSelected = stage === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStage(s.id)}
                  className="flex flex-col gap-1.5 text-left rounded-2xl border-2 px-5 py-5 transition-all"
                  style={{
                    borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                    background: isSelected ? "var(--color-accent-muted)" : "var(--color-bg)",
                  }}
                >
                  <span
                    className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      color: isSelected ? "#fff" : "var(--color-text-2)",
                      background: isSelected ? "var(--color-accent)" : "var(--color-surface-2)",
                    }}
                  >
                    {s.id}
                  </span>
                  <span className="text-sm font-semibold mt-1" style={{ color: "var(--color-text)" }}>{s.label}</span>
                  <span className="text-base font-bold" style={{ color: "var(--color-accent)" }}>{s.goalTry}</span>
                  <span className="text-xs" style={{ color: "var(--color-text-3)" }}>{s.goalEur}</span>
                </button>
              );
            })}
          </div>

          {/* Dinamik limit tablosu */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <div className="px-5 py-3.5" style={{ background: "var(--color-surface)" }}>
              <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                Etap {activeStage.id} — {activeStage.label} sonrası ücretsiz limitler
              </span>
            </div>
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderTop: "1px solid var(--color-border)" }}>
                  <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Özellik</th>
                  <th className="text-center px-5 py-3 font-semibold" style={{ color: "var(--color-text-2)" }}>Şimdiki</th>
                  <th className="text-center px-5 py-3 font-semibold" style={{ color: "var(--color-accent)" }}>Etap {activeStage.id} sonrası</th>
                </tr>
              </thead>
              <tbody>
                {activeStage.limits.map((row, i) => (
                  <tr key={row.label} style={{ borderTop: "1px solid var(--color-border)", background: i % 2 === 0 ? "var(--color-bg)" : "var(--color-surface)" }}>
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--color-text)" }}>{row.label}</td>
                    <td className="px-5 py-3 text-center" style={{ color: "var(--color-text-2)" }}>{row.free}</td>
                    <td className="px-5 py-3 text-center font-semibold" style={{ color: "var(--color-accent)" }}>{row.boosted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Fon kullanımı */}
      <section className="py-12 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>Fon Kullanımı</h2>
          <div className="flex flex-col gap-4">
            {FUND_USAGE.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{item.label}</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--color-text-2)" }}>%{item.pct}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-surface-2)" }}>
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destek miktarı seçimi */}
      <section id="destek-miktar" className="py-12 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="container" style={{ maxWidth: "640px" }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>Destek Miktarını Seç</h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-2)" }}>
            Tek seferlik katkın, kampanya hedefine doğrudan eklenir.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {AMOUNTS.map(a => {
              const isSelected = amount === a && !customAmount;
              return (
                <button
                  key={a}
                  onClick={() => selectAmount(a)}
                  className="py-4 rounded-xl border-2 text-base font-bold transition-all"
                  style={{
                    borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                    background: isSelected ? "var(--color-accent-muted)" : "var(--color-bg)",
                    color: isSelected ? "var(--color-accent)" : "var(--color-text)",
                  }}
                >
                  {a}
                </button>
              );
            })}
          </div>

          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl border mb-6"
            style={{ borderColor: customAmount ? "var(--color-accent)" : "var(--color-border)", background: "var(--color-bg)" }}
          >
            <span className="text-sm font-semibold" style={{ color: "var(--color-text-2)" }}>₺</span>
            <input
              type="number"
              min={10}
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              placeholder="Özel tutar gir"
              className="flex-1 outline-none text-sm"
              style={{ background: "transparent", color: "var(--color-text)" }}
            />
          </div>

          <button
            className="w-full py-4 text-sm font-semibold rounded-xl text-white flex items-center justify-center gap-2"
            style={{ background: "var(--color-accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            {customAmount ? `₺${customAmount} ile Güvenli Ödeme` : `${amount} ile Güvenli Ödeme`}
          </button>
          <p className="text-xs text-center mt-3" style={{ color: "var(--color-text-3)" }}>
            Ödemeler 256-bit SSL ile şifrelenir. Katkın Şeffaflık Raporu&apos;nda izlenebilir.
          </p>
        </div>
      </section>
    </div>
  );
}
