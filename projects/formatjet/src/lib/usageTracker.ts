"use client";

/* ═══════════════════════════════════════════════════
   FormatJet — Araç Kullanım Takip Sistemi
   localStorage key: "fj-usage"
   Yapı: { [toolId]: { total: number, byLang: { [langCode]: number } } }
   ═══════════════════════════════════════════════════ */

const STORAGE_KEY = "fj-usage";

export type UsageData = Record<string, {
  total:  number;
  byLang: Record<string, number>;
}>;

function readUsage(): UsageData {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeUsage(data: UsageData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* localStorage dolu olabilir — sessizce geç */
  }
}

/**
 * Bir araç kullanıldığında çağrılır.
 * toolId: araç kimliği (tools.ts'deki id alanı)
 * Dil bilgisi localStorage'dan otomatik okunur.
 */
export function trackToolUsage(toolId: string): void {
  const lang = (typeof window !== "undefined" && localStorage.getItem("fj-lang")) || "TR";
  const data = readUsage();

  if (!data[toolId]) {
    data[toolId] = { total: 0, byLang: {} };
  }

  data[toolId].total += 1;
  data[toolId].byLang[lang] = (data[toolId].byLang[lang] ?? 0) + 1;

  writeUsage(data);

  /* Diğer sekmelere/bileşenlere bildir */
  window.dispatchEvent(new CustomEvent("fj-usage-update", { detail: { toolId, lang } }));
}

/**
 * Tüm araçların kullanım verisini döndürür.
 */
export function getAllUsage(): UsageData {
  return readUsage();
}

/**
 * Belirli bir aracın kullanım sayısını döndürür.
 */
export function getToolUsage(toolId: string): { total: number; byLang: Record<string, number> } {
  const data = readUsage();
  return data[toolId] ?? { total: 0, byLang: {} };
}

/**
 * Araç listesini belirli bir dile göre kullanım sırasına dizer.
 * monthlySearches'i tiebreaker olarak kullanır.
 */
export function rankByUsage<T extends { id: string; monthlySearches?: number }>(
  tools: T[],
  lang: string,
): T[] {
  const data = readUsage();
  return [...tools].sort((a, b) => {
    const ua = data[a.id];
    const ub = data[b.id];
    /* Dile özgü kullanım 2× ağırlık taşır */
    const scoreA = ua ? (ua.byLang[lang] ?? 0) * 2 + ua.total : 0;
    const scoreB = ub ? (ub.byLang[lang] ?? 0) * 2 + ub.total : 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return (b.monthlySearches ?? 0) - (a.monthlySearches ?? 0);
  });
}

/**
 * Araç sayfasının mount sırasında çağrılabilir yardımcı.
 * Client bileşenlerinde useEffect içinde kullan:
 *
 *   useEffect(() => { trackToolUsage("pdf-birlestir"); }, []);
 *
 * Veya doğrudan trackToolUsage'ı import ederek kullan.
 */
export { trackToolUsage as recordView };
