"use client";
import dynamic from "next/dynamic";
const PdfToWordClient = dynamic(() => import("./PdfToWordClient"), { ssr: false });
export default function PdfToWordLoader() { return <PdfToWordClient />; }
