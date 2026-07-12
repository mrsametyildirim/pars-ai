"use client";
import dynamic from "next/dynamic";
const PdfToExcelClient = dynamic(() => import("./PdfToExcelClient"), { ssr: false });
export default function PdfToExcelLoader() { return <PdfToExcelClient />; }
