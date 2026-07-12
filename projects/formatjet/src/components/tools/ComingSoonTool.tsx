type Props = {
  toolName: string;
  inputFormats: string[];
  outputFormats?: string[];
  accentColor?: string;
  eta?: string;
};

export default function ComingSoonTool({
  toolName,
  inputFormats,
  outputFormats,
  accentColor = "#F05A28",
  eta = "Yakında",
}: Props) {
  return (
    <div className="space-y-5">
      {/* Durum bandı */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
        style={{ borderColor: `${accentColor}4D`, background: `${accentColor}0D` }}>
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: accentColor }} />
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: accentColor }}>Geliştirme Aşamasında</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>
            {toolName} aracı {eta} kullanıma açılacak. Şu an ön kayıt listesine eklenebilirsiniz.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
          style={{ background: `${accentColor}20`, color: accentColor }}>
          {eta}
        </span>
      </div>

      {/* Önizleme drop zone (disabled) */}
      <div className="border-2 border-dashed rounded-xl py-16 text-center"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="text-4xl mb-4 opacity-40">⚙️</div>
        <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text-2)" }}>
          {toolName}
        </p>
        <p className="text-xs mb-4" style={{ color: "var(--color-text-3)" }}>
          {inputFormats.join(", ").toUpperCase()} →{" "}
          {(outputFormats ?? []).join(", ").toUpperCase() || "..."}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accentColor }} />
          <span className="text-xs" style={{ color: "var(--color-text-3)" }}>Henüz aktif değil</span>
        </div>
      </div>

      {/* Ön kayıt */}
      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <p className="text-sm font-medium mb-3" style={{ color: "var(--color-text)" }}>
          Hazır olduğunda haberdar ol
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="eposta@ornek.com"
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none border"
            style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            disabled
          />
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
            style={{ background: accentColor, color: "#fff" }}
            disabled
          >
            Kayıt Ol
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--color-text-3)" }}>
          Ön kayıt sistemi yakında açılacak.
        </p>
      </div>

      {/* Alternatif araçlar */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-3)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
        </svg>
        Bu araç sunucu taraflı işlem gerektiriyor. Tarayıcı tabanlı araçlarımız şu an aktif.
      </div>
    </div>
  );
}
