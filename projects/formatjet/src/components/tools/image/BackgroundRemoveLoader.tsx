"use client";

import dynamic from "next/dynamic";

const BackgroundRemoveClient = dynamic(() => import("./BackgroundRemoveClient"), { ssr: false });

export default function BackgroundRemoveLoader() {
  return <BackgroundRemoveClient />;
}
