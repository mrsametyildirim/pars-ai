"use client";

import dynamic from "next/dynamic";

const ImageMergeClient = dynamic(() => import("./ImageMergeClient"), {
  ssr: false,
  loading: () => (
    <div className="border-2 border-dashed rounded-xl py-14 text-center animate-pulse"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
      <p className="text-sm" style={{ color: "var(--color-text-3)" }}>Yükleniyor...</p>
    </div>
  ),
});

export default function ImageMergeLoader() {
  return <ImageMergeClient />;
}
