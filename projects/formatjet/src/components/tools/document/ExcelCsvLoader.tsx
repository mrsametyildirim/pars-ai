"use client";

import dynamic from "next/dynamic";

const ExcelCsvClient = dynamic(() => import("./ExcelCsvClient"), { ssr: false });

export function ExcelToCsvLoader() {
  return <ExcelCsvClient mode="excel-to-csv" />;
}

export function CsvToExcelLoader() {
  return <ExcelCsvClient mode="csv-to-excel" />;
}
