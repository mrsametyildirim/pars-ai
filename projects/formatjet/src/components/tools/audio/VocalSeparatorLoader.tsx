"use client";
import dynamic from "next/dynamic";
const VocalSeparatorClient = dynamic(() => import("./VocalSeparatorClient"), { ssr: false });
export default function VocalSeparatorLoader() { return <VocalSeparatorClient />; }
