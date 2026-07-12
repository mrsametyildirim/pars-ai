"use client";
import dynamic from "next/dynamic";
const WordCompressClient = dynamic(() => import("./WordCompressClient"), { ssr: false });
export default function WordCompressLoader() { return <WordCompressClient />; }
