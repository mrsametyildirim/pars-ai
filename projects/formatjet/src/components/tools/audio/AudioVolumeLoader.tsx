"use client";

import dynamic from "next/dynamic";

const AudioVolumeClient = dynamic(() => import("./AudioVolumeClient"), { ssr: false });

export default function AudioVolumeLoader() {
  return <AudioVolumeClient />;
}
