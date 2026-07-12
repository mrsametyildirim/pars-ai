"use client";

import dynamic from "next/dynamic";

const ExcelToPdfClient = dynamic(() => import("./ExcelToPdfClient"), { ssr: false });

export default function ExcelToPdfLoader() {
  return <ExcelToPdfClient />;
}
