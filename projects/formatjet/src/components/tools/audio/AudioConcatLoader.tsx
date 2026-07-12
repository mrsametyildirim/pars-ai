"use client";

import dynamic from "next/dynamic";

const AudioConcatClient = dynamic(() => import("./AudioConcatClient"), { ssr: false });

export default function AudioConcatLoader() {
  return <AudioConcatClient />;
}
