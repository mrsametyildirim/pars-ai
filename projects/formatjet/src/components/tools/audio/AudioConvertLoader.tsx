"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const AudioConvertClient = dynamic(() => import("./AudioConvertClient"), { ssr: false });

type Props = ComponentProps<typeof AudioConvertClient>;

export default function AudioConvertLoader(props: Props) {
  return <AudioConvertClient {...props} />;
}
