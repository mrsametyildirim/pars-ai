"use client";

import Link from "next/link";
import { useState } from "react";

type PlanId = "free" | "pro" | "business";
type Billing = "monthly" | "yearly";

const PLANS: {
  id: PlanId;
  name: string;
  price: { monthly: string; yearly: string };
  priceNote: string;
  desc: string;
  highlight?: boolean;
  cta: string;
  features: string[];
}[] = [
  {
    id: "free",
    name: "Ücretsiz",
    price: { monthly: "₺0", yearly: "₺0" },
    priceNote: "her zaman",
    desc: "Bireysel ve ara sıra kullanım için.",
    cta: "Mevcut Planın",
    features: [
      "10 standart işlem / gün",
      "25 MB dosya boyutu limiti",
      "Reklamlı deneyim",
      "Temel araçlara erişim",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: "€7,99", yearly: "€69,90" },
    priceNote: "aylık / yıllık",
    desc: "Düzenli kullanan bireyler ve serbest çalışanlar için.",
    highlight: true,
    cta: "Pro'ya Geç",
    features: [
      "Sınırsız standart işlem",
      "2 GB dosya boyutu limiti",
      "Reklamsız deneyim",
      "Toplu işlem desteği",
      "Öncelikli kuyruk",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: { monthly: "€29,99", yearly: "PDF kaynak" },
    priceNote: "aylık",
    desc: "Ekipler ve yüksek hacimli iş akışları için.",
    cta: "Business'a Geç",
    features: [
      "Sınırsız işlem + toplu kuyruk",
      "10 GB dosya boyutu limiti",
      "API erişimi",
      "Öncelikli destek",
      "Çoklu kullanıcı yönetimi",
    ],
  },
];

const LIMIT_ROWS: { label: string; free: string; pro: string; business: string }[] = [
  { label: "Standart işlem",   free: "10 / gün",  pro: "Sınırsız",   business: "Sınırsız" },
  { label: "PDF",              free: "10 MB",     pro: "500 MB",     business: "2 GB" },
  { label: "Belge",            free: "10 MB",     pro: "500 MB",     business: "2 GB" },
  { label: "Görsel",           free: "25 MB",     pro: "1 GB",       business: "5 GB" },
  { label: "Toplu işlem",      free: "—",         pro: "20 dosya",   business: "200 dosya" },
  { label: "Video",            free: "50 MB",     pro: "2 GB",       business: "10 GB" },
  { label: "Ses",              free: "25 MB",     pro: "1 GB",       business: "5 GB" },
  { label: "OCR",              free: "5 sayfa/ay", pro: "500 sayfa/ay", business: "Sınırsız" },
  { label: "Jet kredisi",      free: "Yok",       pro: "100 / ay",   business: "500 / ay" },
  { label: "Eş zaman kuyruk",  free: "1",         pro: "5",          business: "20" },
];

function CheckIcon({ color = "var(--color-accent)" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function ProPage() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="pt-16 pb-10">
        <div className="container" style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{
            fontSize: "clamp(1.9rem,4vw,2.6rem)",
            fontWeight: 800,
            color: "var(--color-text)",
            letterSpacing: "-0.5px",
            lineHeight: 1.15,
            marginBottom: "12px",
          }}>
            Daha yüksek limit, <span style={{ color: "var(--color-accent)" }}>daha hızlı dönüşüm.</span>
          </h1>
          <p style={{ fontSize: "16px", color: "var(--color-text-2)", lineHeight: 1.6 }}>
            İhtiyacına uygun planı seç, sınırsız dönüşümün keyfini çıkar.
          </p>

          {/* Billing toggle */}
          <div
            className="inline-flex items-center gap-1 mt-8 p-1 rounded-xl border"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
          >
            <button
              onClick={() => setBilling("monthly")}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                color: billing === "monthly" ? "#fff" : "var(--color-text-2)",
                background: billing === "monthly" ? "var(--color-accent)" : "transparent",
              }}
            >
              Aylık
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                color: billing === "yearly" ? "#fff" : "var(--color-text-2)",
                background: billing === "yearly" ? "var(--color-accent)" : "transparent",
              }}
            >
              Yıllık <span style={{ color: billing === "yearly" ? "#DBEAFE" : "var(--color-accent)" }}>· %27 tasarruf</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plan kartları */}
      <section className="pb-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ maxWidth: "980px", margin: "0 auto" }}>
            {PLANS.map(plan => (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-2xl border p-7"
                style={{
                  borderColor: plan.highlight ? "var(--color-accent)" : "var(--color-border)",
                  background: "var(--color-bg)",
                  boxShadow: plan.highlight ? "0 0 0 3px rgba(37,99,235,0.12), var(--shadow-card)" : "var(--shadow-card)",
                }}
              >
                {plan.highlight && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full text-white"
                    style={{ background: "var(--color-accent)" }}
                  >
                    En Popüler
                  </span>
                )}
                <h3 className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>{plan.name}</h3>
                <p className="text-sm mb-5" style={{ color: "var(--color-text-2)" }}>{plan.desc}</p>

                <div className="mb-6">
                  <span style={{ fontSize: "34px", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-1px" }}>
                    {plan.id === "business" && billing === "yearly" ? plan.price.monthly : plan.price[billing]}
                  </span>
                  <span className="text-sm ml-1" style={{ color: "var(--color-text-3)" }}>
                    {plan.id === "free" ? plan.priceNote : billing === "monthly" ? "/ay" : plan.id === "business" ? "/ay (PDF kaynak)" : "/yıl"}
                  </span>
                </div>

                <ul className="flex flex-col gap-3 mb-7 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--color-text-2)" }}>
                      <span className="mt-0.5"><CheckIcon color={plan.highlight ? "var(--color-accent)" : "#10B981"} /></span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={plan.id === "free"}
                  className="w-full py-3 text-sm font-semibold rounded-xl transition-all"
                  style={{
                    color: plan.id === "free" ? "var(--color-text-3)" : plan.highlight ? "#fff" : "var(--color-accent)",
                    background: plan.id === "free" ? "var(--color-surface-2)" : plan.highlight ? "var(--color-accent)" : "var(--color-accent-muted)",
                    cursor: plan.id === "free" ? "default" : "pointer",
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limit tablosu */}
      <section className="pb-16">
        <div className="container" style={{ maxWidth: "980px", margin: "0 auto" }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: "var(--color-text)" }}>
            Planları Karşılaştır
          </h2>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--color-surface)" }}>
                    <th className="text-left px-5 py-3.5 font-semibold" style={{ color: "var(--color-text)" }}>Özellik</th>
                    <th className="text-center px-5 py-3.5 font-semibold" style={{ color: "var(--color-text-2)" }}>Ücretsiz</th>
                    <th className="text-center px-5 py-3.5 font-semibold" style={{ color: "var(--color-accent)" }}>Pro</th>
                    <th className="text-center px-5 py-3.5 font-semibold" style={{ color: "var(--color-text)" }}>Business</th>
                  </tr>
                </thead>
                <tbody>
                  {LIMIT_ROWS.map((row, i) => (
                    <tr key={row.label} style={{ borderTop: "1px solid var(--color-border)", background: i % 2 === 0 ? "var(--color-bg)" : "var(--color-surface)" }}>
                      <td className="px-5 py-3 font-medium" style={{ color: "var(--color-text)" }}>{row.label}</td>
                      <td className="px-5 py-3 text-center" style={{ color: "var(--color-text-2)" }}>{row.free}</td>
                      <td className="px-5 py-3 text-center font-semibold" style={{ color: "var(--color-accent)" }}>{row.pro}</td>
                      <td className="px-5 py-3 text-center" style={{ color: "var(--color-text)" }}>{row.business}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Uyarı bandı */}
      <section className="pb-12">
        <div className="container" style={{ maxWidth: "980px", margin: "0 auto" }}>
          <div
            className="flex items-start gap-3 rounded-xl border-l-4 px-5 py-4"
            style={{ borderColor: "#F59E0B", background: "#FFFBEB" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="text-sm" style={{ color: "#92400E", lineHeight: 1.5 }}>
              Ücretsiz plan limitleri topluluk desteğiyle güncellenir. Business planı için ödeme bilgileri kaynak PDF ile paylaşılmıştır ve doğrulama sonrası aktive edilir.
            </p>
          </div>
        </div>
      </section>

      {/* Destek Ol mini kart */}
      <section>
        <div className="container" style={{ maxWidth: "980px", margin: "0 auto" }}>
          <div
            className="flex flex-col md:flex-row items-center gap-5 rounded-2xl px-7 py-6"
            style={{ background: "var(--color-navy)" }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.18)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#3B82F6">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-base font-semibold text-white mb-1">Plan almadan da destek olabilirsin</h3>
              <p className="text-sm" style={{ color: "var(--color-navy-text)" }}>
                Katkın, ücretsiz kullanıcıların limitlerini herkes için büyütür.
              </p>
            </div>
            <Link
              href="/destek"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white shrink-0"
              style={{ background: "#2563EB" }}
            >
              Destek Ol
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
