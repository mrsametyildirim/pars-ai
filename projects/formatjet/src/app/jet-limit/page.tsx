"use client";

import { useState } from "react";

const PACKAGES = [
  { amount: "₺100", credits: "120 Jet kredisi", value: "" },
  { amount: "₺250", credits: "320 Jet kredisi", value: "%7 bonus" },
  { amount: "₺500", credits: "680 Jet kredisi", value: "%13 bonus" },
  { amount: "₺1.000", credits: "1.450 Jet kredisi", value: "%21 bonus" },
];

const FEATURES = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Anında Aktif",
    desc: "Satın alım sonrası krediler hesabına anında yansır.",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Süresiz Kullanım",
    desc: "Jet kredilerinin son kullanma tarihi yoktur.",
  },
  {
    icon: "M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-9.999 5.002 5.002 0 0 0-9.78 2.096A4.001 4.001 0 0 0 3 15z",
    title: "Tüm Araçlarda Geçerli",
    desc: "84+ araçta toplu işlem ve yüksek boyut limiti için kullan.",
  },
];

export default function JetLimitPage() {
  const [selected, setSelected] = useState<number>(1);
  const [customAmount, setCustomAmount] = useState("");

  function selectPackage(i: number) {
    setSelected(i);
    setCustomAmount("");
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="pt-16 pb-10">
        <div className="container" style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "var(--color-accent-muted)" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--color-accent)">
              <path d="M13 2 3 14h7v8l10-12h-7z" />
            </svg>
          </div>
          <h1 style={{
            fontSize: "clamp(1.9rem,4vw,2.5rem)",
            fontWeight: 800,
            color: "var(--color-text)",
            letterSpacing: "-0.5px",
            lineHeight: 1.15,
            marginBottom: "12px",
          }}>
            Jet Limitini Artır
          </h1>
          <p style={{ fontSize: "16px", color: "var(--color-text-2)", lineHeight: 1.6 }}>
            Toplu işlem ve büyük dosyalar için Jet kredisi satın al, sınırları kaldır.
          </p>
        </div>
      </section>

      {/* Kredi paketleri */}
      <section className="pb-12">
        <div className="container" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PACKAGES.map((pkg, i) => {
              const isSelected = selected === i && !customAmount;
              return (
                <button
                  key={pkg.amount}
                  onClick={() => selectPackage(i)}
                  className="relative flex flex-col items-center gap-1.5 rounded-2xl border-2 px-4 py-6 transition-all"
                  style={{
                    borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                    background: isSelected ? "var(--color-accent-muted)" : "var(--color-bg)",
                    boxShadow: isSelected ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
                  }}
                >
                  {pkg.value && (
                    <span
                      className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold rounded-full text-white"
                      style={{ background: "#10B981" }}
                    >
                      {pkg.value}
                    </span>
                  )}
                  <span style={{ fontSize: "22px", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.5px" }}>
                    {pkg.amount}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-2)" }}>{pkg.credits}</span>
                </button>
              );
            })}
          </div>

          {/* Özel tutar */}
          <div className="mt-5">
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
              Diğer tutar
            </label>
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl border"
              style={{
                borderColor: customAmount ? "var(--color-accent)" : "var(--color-border)",
                background: "var(--color-bg)",
              }}
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
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="pb-12 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="container pt-12" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-accent-muted)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-2)" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="container" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <button
            className="w-full py-4 text-sm font-semibold rounded-xl text-white transition-all"
            style={{ background: "var(--color-accent)" }}
          >
            {customAmount ? `₺${customAmount} ile Jet Kredisi Satın Al` : `${PACKAGES[selected].amount} ile Jet Kredisi Satın Al`}
          </button>
          <p className="text-xs text-center mt-3" style={{ color: "var(--color-text-3)" }}>
            Ödemeler güvenli ödeme altyapısı ile işlenir. Krediler süresiz kullanılabilir.
          </p>
        </div>
      </section>
    </div>
  );
}
