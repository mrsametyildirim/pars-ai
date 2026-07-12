"use client";

import dynamic from "next/dynamic";

const VideoConcatClient = dynamic(() => import("./VideoConcatClient"), { ssr: false });

export default function VideoConcatLoader() {
  return <VideoConcatClient />;
}
