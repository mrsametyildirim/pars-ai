"use client";

import dynamic from "next/dynamic";

const loading = () => (
  <div className="flex items-center justify-center py-16">
    <div className="text-sm animate-pulse" style={{ color: "var(--color-text-3)" }}>Araç yükleniyor...</div>
  </div>
);

const VideoConvertClient = dynamic(() => import("./VideoConvertClient"), { ssr: false, loading });
const VideoRotateClient  = dynamic(() => import("./VideoRotateClient"),  { ssr: false, loading });

const VIDEO_ACCENT = "#F05A28";

export function WebmToMp4Loader() {
  return <VideoConvertClient inputFormats={["webm"]} outputFormat="mp4" accentColor={VIDEO_ACCENT} />;
}

export function Mp4ToWebmLoader() {
  return <VideoConvertClient inputFormats={["mp4"]} outputFormat="webm" accentColor={VIDEO_ACCENT} />;
}

export function VideoRotateLoader() { return <VideoRotateClient />; }
