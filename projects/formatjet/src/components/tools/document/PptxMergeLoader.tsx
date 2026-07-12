"use client";
import dynamic from "next/dynamic";
const PptxMergeClient = dynamic(() => import("./PptxMergeClient"), { ssr: false });
export default function PptxMergeLoader() { return <PptxMergeClient />; }
