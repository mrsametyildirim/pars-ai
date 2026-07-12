"use client";
import dynamic from "next/dynamic";
const PptxToImageClient = dynamic(() => import("./PptxToImageClient"), { ssr: false });
export default function PptxToPdfLoader() { return <PptxToImageClient outputFormat="pdf" />; }
