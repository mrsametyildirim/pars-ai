"use client";
import dynamic from "next/dynamic";
const ExcelToJpgClient = dynamic(() => import("./ExcelToJpgClient"), { ssr: false });
export default function ExcelToJpgLoader() { return <ExcelToJpgClient />; }
