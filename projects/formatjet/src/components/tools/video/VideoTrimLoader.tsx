"use client";

import dynamic from "next/dynamic";

const VideoTrimClient = dynamic(() => import("./VideoTrimClient"), { ssr: false });

export default function VideoTrimLoader() {
  return <VideoTrimClient />;
}
