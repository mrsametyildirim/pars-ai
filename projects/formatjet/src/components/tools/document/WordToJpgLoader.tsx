"use client";
import dynamic from "next/dynamic";
const WordToJpgClient = dynamic(() => import("./WordToJpgClient"), { ssr: false });
export default function WordToJpgLoader() { return <WordToJpgClient />; }
