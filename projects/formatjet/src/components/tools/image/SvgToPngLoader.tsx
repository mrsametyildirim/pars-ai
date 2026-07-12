"use client";

import dynamic from "next/dynamic";

const SvgToPngClient = dynamic(() => import("./SvgToPngClient"), {
  ssr: false,
  loading: () => (
    <div className="border-2 border-dashed rounded-xl py-14 text-center animate-pulse"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
      <p className="text-sm" style={{ color: "var(--color-text-3)" }}>Yükleniyor...</p>
    </div>
  ),
});

export default function SvgToPngLoader() {
  return <SvgToPngClient />;
}
