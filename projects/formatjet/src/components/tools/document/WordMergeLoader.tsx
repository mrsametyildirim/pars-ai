"use client";
import dynamic from "next/dynamic";
const WordMergeClient = dynamic(() => import("./WordMergeClient"), { ssr: false });
export default function WordMergeLoader() { return <WordMergeClient />; }
