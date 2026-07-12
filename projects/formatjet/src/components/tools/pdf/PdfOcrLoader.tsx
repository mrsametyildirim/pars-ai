"use client";

import dynamic from "next/dynamic";

const PdfOcrClient = dynamic(() => import("./PdfOcrClient"), { ssr: false });

export default function PdfOcrLoader() {
  return <PdfOcrClient />;
}
