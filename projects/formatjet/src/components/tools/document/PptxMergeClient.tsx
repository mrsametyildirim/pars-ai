"use client";

import { useState, useRef } from "react";

const accentColor = "#F05A28";

async function mergePptxFiles(files: File[]): Promise<Blob> {
  const JSZip = (await import("jszip")).default;

  const zips = await Promise.all(files.map(async f => {
    const ab = await f.arrayBuffer();
    return JSZip.loadAsync(ab);
  }));

  const outZip = new JSZip();
  let slideCount = 0;

  // Copy base structure from first file (themes, layouts, masters)
  const baseZip = zips[0];
  for (const [path, file] of Object.entries(baseZip.files)) {
    if (file.dir) continue;
    if (path.startsWith("ppt/slides/")) continue; // we'll handle slides manually
    const data = await file.async("uint8array");
    outZip.file(path, data);
  }

  // Collect all slides from all presentations
  const slideEntries: { xml: string; relsXml: string; srcZip: typeof baseZip; slideNum: number }[] = [];

  for (const zip of zips) {
    const slideFiles = Object.keys(zip.files)
      .filter(p => p.match(/^ppt\/slides\/slide\d+\.xml$/) && !zip.files[p].dir)
      .sort((a, b) => {
        const na = parseInt(a.match(/\d+/)![0]);
        const nb = parseInt(b.match(/\d+/)![0]);
        return na - nb;
      });

    for (const slidePath of slideFiles) {
      const slideNum = parseInt(slidePath.match(/\d+/)![0]);
      const xml      = await zip.file(slidePath)!.async("text");
      const relsPath = `ppt/slides/_rels/slide${slideNum}.xml.rels`;
      const relsXml  = zip.file(relsPath) ? await zip.file(relsPath)!.async("text") : "";
      slideEntries.push({ xml, relsXml, srcZip: zip, slideNum });
    }
  }

  // Write slides to output
  const slideIdList: string[] = [];
  for (let i = 0; i < slideEntries.length; i++) {
    const newNum  = i + 1;
    slideCount    = newNum;
    const { xml, relsXml } = slideEntries[i];
    outZip.file(`ppt/slides/slide${newNum}.xml`, xml);
    if (relsXml) outZip.file(`ppt/slides/_rels/slide${newNum}.xml.rels`, relsXml);
    slideIdList.push(`<p:sldId id="${256 + i}" r:id="rId${newNum}"/>`);
  }

  // Update presentation.xml slide list
  const presXml = await baseZip.file("ppt/presentation.xml")!.async("text");
  const newPresXml = presXml.replace(
    /<p:sldIdLst>[\s\S]*?<\/p:sldIdLst>/,
    `<p:sldIdLst>${slideIdList.join("")}</p:sldIdLst>`
  );
  outZip.file("ppt/presentation.xml", newPresXml);

  // Update presentation.xml.rels with all slides
  const presRelsPath = "ppt/_rels/presentation.xml.rels";
  let presRels = await baseZip.file(presRelsPath)!.async("text");
  // Remove existing slide relationships
  presRels = presRels.replace(/<Relationship[^>]*slides\/slide\d+[^>]*\/>/g, "");
  // Add new slide relationships before </Relationships>
  const slideRels = Array.from({ length: slideCount }, (_, i) =>
    `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`
  ).join("");
  presRels = presRels.replace("</Relationships>", slideRels + "</Relationships>");
  outZip.file(presRelsPath, presRels);

  return outZip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
}

export default function PptxMergeClient() {
  const [files, setFiles]     = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");
  const inputRef              = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  function addFiles(f: FileList | null) {
    if (!f) return;
    const pptx = Array.from(f).filter(file => file.name.match(/\.pptx?$/i));
    setFiles(prev => [...prev, ...pptx]);
    setDone(false); setError("");
  }

  function removeFile(i: number) { setFiles(prev => prev.filter((_, idx) => idx !== i)); }
  function moveUp(i: number)   { if (i === 0) return; setFiles(p => { const a=[...p];[a[i-1],a[i]]=[a[i],a[i-1]];return a;}); }
  function moveDown(i: number) { setFiles(p => { if(i>=p.length-1)return p; const a=[...p];[a[i],a[i+1]]=[a[i+1],a[i]];return a;}); }

  async function merge() {
    if (files.length < 2) { setError("En az 2 sunum ekleyin."); return; }
    setLoading(true); setError(""); setDone(false);
    try {
      const blob = await mergePptxFiles(files);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a"); a.href=url; a.download="birlestirilmis.pptx"; a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (e) {
      setError("Birleştirme başarısız: " + (e instanceof Error ? e.message : ""));
    } finally { setLoading(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "2rem", textAlign: "center", cursor: "pointer", background: surface }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 0.75rem" }}>
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
        </svg>
        <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.2rem" }}>PPTX dosyalarını sürükle veya tıkla</p>
        <p style={{ color: textTer, fontSize: "0.8rem" }}>Birden fazla PowerPoint seçilebilir</p>
        <input ref={inputRef} type="file" accept=".ppt,.pptx" multiple style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ color: textSec, fontSize: "0.8rem" }}>Sıra önemlidir — slaytlar bu sırayla eklenir:</p>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.75rem", background: surface, borderRadius: "10px", border: `1px solid ${border}` }}>
              <span style={{ color: textTer, fontSize: "0.75rem", fontFamily: "monospace", minWidth: "1.2rem" }}>{i + 1}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
              <span style={{ flex: 1, color: textPri, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
              <span style={{ color: textTer, fontSize: "0.72rem" }}>{(f.size/1024).toFixed(0)} KB</span>
              <button onClick={() => moveUp(i)} disabled={i===0} style={{ background:"none",border:"none",cursor:i===0?"default":"pointer",color:i===0?border:textSec,padding:"2px" }}>↑</button>
              <button onClick={() => moveDown(i)} disabled={i===files.length-1} style={{ background:"none",border:"none",cursor:i===files.length-1?"default":"pointer",color:i===files.length-1?border:textSec,padding:"2px" }}>↓</button>
              <button onClick={() => removeFile(i)} style={{ background:"none",border:"none",cursor:"pointer",color:textTer,padding:"2px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div style={{ padding: "0.75rem 1rem", background: `${accentColor}18`, borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>}
      {done  && <div style={{ padding: "0.75rem 1rem", background: "rgba(16,185,129,0.1)", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", fontSize: "0.85rem" }}>{files.length} sunum başarıyla birleştirildi ve indirildi.</div>}

      <button onClick={merge} disabled={loading || files.length < 2} style={{
        padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
        color: "#fff", cursor: loading||files.length<2 ? "not-allowed":"pointer",
        fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 600, opacity: loading||files.length<2 ? 0.6:1,
      }}>
        {loading ? "Birleştiriliyor…" : `${files.length} Sunumu Birleştir ve İndir`}
      </button>
    </div>
  );
}
