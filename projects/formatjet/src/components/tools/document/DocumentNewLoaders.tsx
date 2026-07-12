"use client";

import dynamic from "next/dynamic";

const loading = () => (
  <div className="flex items-center justify-center py-16">
    <div className="text-sm animate-pulse" style={{ color: "var(--color-text-3)" }}>Araç yükleniyor...</div>
  </div>
);

const TxtToPdfClient = dynamic(() => import("./TxtToPdfClient"), { ssr: false, loading });
const CsvToPdfClient = dynamic(() => import("./CsvToPdfClient"), { ssr: false, loading });

export function TxtToPdfLoader() { return <TxtToPdfClient />; }
export function CsvToPdfLoader() { return <CsvToPdfClient />; }
