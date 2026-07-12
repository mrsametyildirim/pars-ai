"use client";

import dynamic from "next/dynamic";

const VideoToMp3Client = dynamic(() => import("./VideoToMp3Client"), { ssr: false });

export default function VideoToMp3Loader() {
  return <VideoToMp3Client />;
}
