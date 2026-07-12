"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const VideoConvertClient = dynamic(() => import("./VideoConvertClient"), { ssr: false });

type Props = ComponentProps<typeof VideoConvertClient>;

export default function VideoConvertLoader(props: Props) {
  return <VideoConvertClient {...props} />;
}
