"use client";

import dynamic from "next/dynamic";

const WordToPdfClient = dynamic(() => import("./WordToPdfClient"), { ssr: false });

export default function WordToPdfLoader() {
  return <WordToPdfClient />;
}
