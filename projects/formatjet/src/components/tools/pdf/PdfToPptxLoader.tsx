"use client";
import dynamic from "next/dynamic";
const PdfToPptxClient = dynamic(() => import("./PdfToPptxClient"), { ssr: false });
export default function PdfToPptxLoader() { return <PdfToPptxClient />; }
