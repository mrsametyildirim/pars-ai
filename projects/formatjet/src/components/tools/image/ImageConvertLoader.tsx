"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const ImageConvertClient = dynamic(
  () => import("./ImageConvertClient"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-16">
        <div className="text-sm animate-pulse" style={{ color: "var(--color-text-3)" }}>
          Araç yükleniyor...
        </div>
      </div>
    ),
  }
);

type Props = ComponentProps<typeof ImageConvertClient>;

export default function ImageConvertLoader(props: Props) {
  return <ImageConvertClient {...props} />;
}
