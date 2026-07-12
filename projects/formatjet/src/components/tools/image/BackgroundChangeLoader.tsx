"use client";

import dynamic from "next/dynamic";

const BackgroundChangeClient = dynamic(() => import("./BackgroundChangeClient"), { ssr: false });

export default function BackgroundChangeLoader() {
  return <BackgroundChangeClient />;
}
