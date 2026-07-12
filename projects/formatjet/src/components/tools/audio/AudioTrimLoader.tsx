"use client";

import dynamic from "next/dynamic";

const AudioTrimClient = dynamic(() => import("./AudioTrimClient"), { ssr: false });

export default function AudioTrimLoader() {
  return <AudioTrimClient />;
}
