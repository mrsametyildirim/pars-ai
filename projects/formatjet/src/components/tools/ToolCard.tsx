import Link from "next/link";
import type { Tool } from "@/data/tools";
import { CATEGORY_META } from "@/data/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  const meta = CATEGORY_META[tool.category];

  return (
    <Link
      href={`/${tool.slug}`}
      className="group flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 relative"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-bg)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border-2)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        {tool.isNew && (
          <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
            style={{ color: "var(--color-accent)", background: "var(--color-accent-muted)" }}>
            Yeni
          </span>
        )}
        {tool.premium && (
          <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
            style={{ color: "#D97706", background: "#FEF3C7" }}>
            Pro
          </span>
        )}
        {tool.status === "live" && !tool.isNew && !tool.premium && (
          <span className="tool-live-dot" title="Canlı" />
        )}
      </div>

      {/* İkon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
        style={{ background: `${meta.color}12` }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d={tool.icon} />
        </svg>
      </div>

      {/* İsim + açıklama */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold leading-tight mb-1" style={{ color: "var(--color-text)" }}>
          {tool.name}
        </h3>
        <p className="text-xs leading-snug line-clamp-2" style={{ color: "var(--color-text-2)" }}>
          {tool.description}
        </p>
      </div>

      {/* Format etiketleri */}
      {tool.inputFormats.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto">
          {tool.inputFormats.slice(0, 3).map(fmt => (
            <span key={fmt} className="font-mono text-[10px] px-1.5 py-0.5 rounded uppercase"
              style={{ color: "var(--color-text-3)", background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
              {fmt}
            </span>
          ))}
          {tool.inputFormats.length > 3 && (
            <span className="font-mono text-[10px] px-1 py-0.5" style={{ color: "var(--color-text-3)" }}>
              +{tool.inputFormats.length - 3}
            </span>
          )}
          {tool.outputFormats && tool.outputFormats.length > 0 && (
            <>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="self-center" style={{ color: "var(--color-text-3)" }}>
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
              {tool.outputFormats.slice(0, 2).map(fmt => (
                <span key={fmt} className="font-mono text-[10px] px-1.5 py-0.5 rounded uppercase"
                  style={{ color: meta.color, background: `${meta.color}10` }}>
                  {fmt}
                </span>
              ))}
            </>
          )}
        </div>
      )}
    </Link>
  );
}
