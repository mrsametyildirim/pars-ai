"use client";

import dynamic from "next/dynamic";

const VideoGifClient = dynamic(() => import("./VideoGifClient"), { ssr: false });

export default function VideoGifLoader() {
  return <VideoGifClient />;
}
