"use client";

import dynamic from "next/dynamic";

const loading = () => (
  <div className="flex items-center justify-center py-16">
    <div className="text-sm animate-pulse" style={{ color: "var(--color-text-3)" }}>Araç yükleniyor...</div>
  </div>
);

const AudioConvertClient = dynamic(() => import("./AudioConvertClient"), { ssr: false, loading });

export function M4aToMp3Loader() {
  return <AudioConvertClient inputFormats={["m4a"]} outputFormat="mp3" />;
}

export function OggToMp3Loader() {
  return <AudioConvertClient inputFormats={["ogg"]} outputFormat="mp3" />;
}
