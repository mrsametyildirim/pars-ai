"use client";

import { useState, useRef } from "react";

const EMU = 914400;
const SLIDE_W = 10 * EMU; // default 10 inches
const SLIDE_H =  7.5 * EMU; // default 7.5 inches
const CANVAS_W = 1280;
const CANVAS_H = 960;

type OutputFormat = "jpg" | "pdf";

interface Shape {
  x: number; y: number; w: number; h: number;
  fillColor?: string;
  texts: { text: string; size: number; bold: boolean; color: string; align: string }[];
}

function parseEmu(val: string | null): number {
  if (!val) return 0;
  return parseInt(val) || 0;
}

function parseColor(el: Element | null): string {
  if (!el) return "";
  const solid = el.querySelector("solidFill");
  if (!solid) return "";
  const srgb = solid.querySelector("srgbClr");
  if (srgb) return "#" + (srgb.getAttribute("val") || "000000");
  const theme = solid.querySelector("schemeClr");
  if (theme) {
    const val = theme.getAttribute("val") || "";
    const map: Record<string, string> = {
      dk1: "#000000", lt1: "#FFFFFF", dk2: "#1F3864", lt2: "#E7E6E6",
      accent1: "#4472C4", accent2: "#ED7D31", accent3: "#A9D18E",
    };
    return map[val] || "#333333";
  }
  return "";
}

function parseSlide(xml: string): Shape[] {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(xml, "text/xml");
  const shapes: Shape[] = [];

  const spTree = doc.querySelector("spTree");
  if (!spTree) return shapes;

  for (const sp of Array.from(spTree.querySelectorAll("sp"))) {
    const xfrm  = sp.querySelector("spPr xfrm");
    const off   = xfrm?.querySelector("off");
    const ext   = xfrm?.querySelector("ext");
    const x     = parseEmu(off?.getAttribute("x") ?? null);
    const y     = parseEmu(off?.getAttribute("y") ?? null);
    const w     = parseEmu(ext?.getAttribute("cx") ?? null);
    const h     = parseEmu(ext?.getAttribute("cy") ?? null);
    const spPr  = sp.querySelector("spPr");
    const fillColor = parseColor(spPr);

    const texts: Shape["texts"] = [];
    for (const para of Array.from(sp.querySelectorAll("txBody > p"))) {
      const pPr   = para.querySelector("pPr");
      const align = pPr?.getAttribute("algn") || "l";
      const rNodes = Array.from(para.querySelectorAll("r"));
      if (rNodes.length === 0) continue;

      for (const r of rNodes) {
        const t    = r.querySelector("t")?.textContent || "";
        if (!t.trim() && rNodes.length > 1) continue;
        const rPr  = r.querySelector("rPr");
        const szAttr = rPr?.getAttribute("sz");
        const size = szAttr ? parseInt(szAttr) / 100 : 18;
        const bold = rPr?.getAttribute("b") === "1";
        const color = parseColor(rPr) || "#FFFFFF";
        texts.push({ text: t, size, bold, color, align });
      }
    }

    if (texts.length > 0 || fillColor) {
      shapes.push({ x, y, w, h, fillColor, texts });
    }
  }

  // Sort by Y then X (reading order)
  shapes.sort((a, b) => a.y - b.y || a.x - b.x);
  return shapes;
}

function renderSlide(canvas: HTMLCanvasElement, shapes: Shape[], bgColor = "#1e293b") {
  const ctx = canvas.getContext("2d")!;
  const scaleX = CANVAS_W / SLIDE_W;
  const scaleY = CANVAS_H / SLIDE_H;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  for (const shape of shapes) {
    const sx = shape.x * scaleX;
    const sy = shape.y * scaleY;
    const sw = shape.w * scaleX;
    const sh = shape.h * scaleY;

    if (shape.fillColor) {
      ctx.fillStyle = shape.fillColor;
      ctx.fillRect(sx, sy, sw, sh);
    }

    let textY = sy + 8;
    for (const t of shape.texts) {
      const fs = Math.max(10, Math.min(t.size * scaleY * 1.2, 72));
      ctx.font  = `${t.bold ? "bold " : ""}${fs}px system-ui, sans-serif`;
      ctx.fillStyle = t.color || "#FFFFFF";
      ctx.textBaseline = "top";

      const textAlign: CanvasTextAlign =
        t.align === "ctr" ? "center" : t.align === "r" ? "right" : "left";
      ctx.textAlign = textAlign;

      const textX = t.align === "ctr" ? sx + sw / 2 : t.align === "r" ? sx + sw : sx + 8;
      const maxW  = Math.max(sw - 16, 10);

      const words = t.text.split(" ");
      let line = "";
      for (const word of words) {
        const testLine = line ? line + " " + word : word;
        if (ctx.measureText(testLine).width > maxW && line) {
          ctx.fillText(line, textX, textY, maxW);
          line  = word;
          textY += fs * 1.25;
        } else { line = testLine; }
      }
      if (line) { ctx.fillText(line, textX, textY, maxW); textY += fs * 1.35; }
    }
  }
}

export default function PptxToImageClient({ outputFormat }: { outputFormat: OutputFormat }) {
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState("");
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  const accent = "#F05A28";

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function convert() {
    if (!file) return;
    setLoading(true); setError(""); setDone(false); setProgress(5);
    setStatus("PPTX yükleniyor…");
    try {
      const JSZip = (await import("jszip")).default;
      const ab    = await file.arrayBuffer();
      const zip   = await JSZip.loadAsync(ab);

      const slideFiles = Object.keys(zip.files)
        .filter(p => p.match(/^ppt\/slides\/slide\d+\.xml$/) && !zip.files[p].dir)
        .sort((a, b) => {
          const na = parseInt(a.match(/\d+/)![0]);
          const nb = parseInt(b.match(/\d+/)![0]);
          return na - nb;
        });

      const numSlides = slideFiles.length;
      if (numSlides === 0) throw new Error("Slayt bulunamadı.");

      setStatus(`${numSlides} slayt bulundu`);

      if (outputFormat === "jpg") {
        for (let i = 0; i < numSlides; i++) {
          setProgress(Math.round((i / numSlides) * 90) + 5);
          setStatus(`Slayt ${i+1}/${numSlides} dönüştürülüyor…`);

          const xml    = await zip.file(slideFiles[i])!.async("text");
          const shapes = parseSlide(xml);
          const canvas = document.createElement("canvas");
          canvas.width  = CANVAS_W;
          canvas.height = CANVAS_H;
          renderSlide(canvas, shapes);

          await new Promise<void>(res => {
            canvas.toBlob(blob => {
              if (!blob) { res(); return; }
              const url = URL.createObjectURL(blob);
              const a   = document.createElement("a");
              a.href     = url;
              a.download = file.name.replace(/\.pptx?$/i, `_slayt_${String(i+1).padStart(2,"0")}.jpg`);
              a.click();
              URL.revokeObjectURL(url);
              setTimeout(res, 150);
            }, "image/jpeg", 0.92);
          });
        }
      } else {
        const jsPDF = (await import("jspdf")).jsPDF;
        const doc   = new jsPDF({ orientation: "landscape", unit: "px", format: [CANVAS_W, CANVAS_H] });

        for (let i = 0; i < numSlides; i++) {
          setProgress(Math.round((i / numSlides) * 90) + 5);
          setStatus(`Slayt ${i+1}/${numSlides} işleniyor…`);
          if (i > 0) doc.addPage([CANVAS_W, CANVAS_H], "landscape");

          const xml    = await zip.file(slideFiles[i])!.async("text");
          const shapes = parseSlide(xml);
          const canvas = document.createElement("canvas");
          canvas.width  = CANVAS_W;
          canvas.height = CANVAS_H;
          renderSlide(canvas, shapes);

          const imgData = canvas.toDataURL("image/jpeg", 0.92);
          doc.addImage(imgData, "JPEG", 0, 0, CANVAS_W, CANVAS_H);
        }

        const blob = doc.output("blob");
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = file.name.replace(/\.pptx?$/i, ".pdf");
        a.click();
        URL.revokeObjectURL(url);
      }

      setDone(true); setProgress(100);
      setStatus(outputFormat === "jpg" ? `${numSlides} slayt indirildi!` : "PDF oluşturuldu!");
    } catch (e) {
      setError("Dönüştürme başarısız: " + (e instanceof Error ? e.message : ""));
    } finally {
      setLoading(false);
      setTimeout(() => { setProgress(0); setStatus(""); }, 3000);
    }
  }

  const label = outputFormat === "jpg" ? "JPG" : "PDF";
  const actionText = outputFormat === "jpg" ? "Her slayt ayrı JPG olarak indirilir" : "Tüm slaytlar tek PDF dosyasında birleştirilir";

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1.5rem" }}>
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) setFile(f); }}
          style={{ border:`2px dashed ${border}`,borderRadius:"16px",padding:"3rem 2rem",textAlign:"center",cursor:"pointer",background:surface }}
          onMouseEnter={e=>(e.currentTarget.style.borderColor=accent)}
          onMouseLeave={e=>(e.currentTarget.style.borderColor=border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" style={{ margin:"0 auto 1rem" }}>
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
          </svg>
          <p style={{ color:textPri,fontWeight:500,marginBottom:"0.25rem" }}>PowerPoint dosyasını sürükle veya tıkla</p>
          <p style={{ color:textTer,fontSize:"0.8rem" }}>{actionText}</p>
          <input ref={inputRef} type="file" accept=".ppt,.pptx" style={{ display:"none" }}
            onChange={e => { const f=e.target.files?.[0]; if(f) { setFile(f); setDone(false); } }} />
        </div>
      ) : (
        <>
          <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.875rem 1rem",background:surface,borderRadius:"12px",border:`1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ color:textPri,fontSize:"0.875rem",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.name}</p>
              <p style={{ color:textTer,fontSize:"0.75rem" }}>{(file.size/1024).toFixed(0)} KB</p>
            </div>
            <button onClick={() => { setFile(null); setDone(false); setError(""); }} style={{ background:"none",border:"none",cursor:"pointer",color:textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div style={{ padding:"0.75rem",background:`${accent}0D`,borderRadius:"10px",border:`1px solid ${accent}30`,fontSize:"0.8rem",color:textSec }}>
            {actionText}. Metin ve arka plan renkleri korunur; görseller temel seviyede aktarılır.
          </div>

          {error && <div style={{ padding:"0.75rem 1rem",background:`${accent}18`,borderRadius:"10px",color:accent,fontSize:"0.85rem" }}>{error}</div>}
          {done  && <div style={{ padding:"0.75rem 1rem",background:"rgba(16,185,129,0.1)",borderRadius:"10px",border:"1px solid rgba(16,185,129,0.3)",color:"#10B981",fontSize:"0.85rem" }}>Dönüştürme tamamlandı!</div>}

          {(loading || (progress>0 && !done)) && (
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.35rem" }}>
                <span style={{ color:textSec,fontSize:"0.8rem" }}>{status}</span>
                <span style={{ color:textTer,fontSize:"0.75rem" }}>{progress>0?progress+"%":""}</span>
              </div>
              <div style={{ height:"4px",background:border,borderRadius:"4px",overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${progress}%`,background:accent,borderRadius:"4px",transition:"width 0.3s" }} />
              </div>
            </div>
          )}

          <button onClick={convert} disabled={loading} style={{
            padding:"0.875rem",borderRadius:"12px",border:"none",background:accent,
            color:"#fff",cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",
            fontSize:"0.9rem",fontWeight:600,opacity:loading?0.7:1,
          }}>
            {loading ? "Dönüştürülüyor…" : `${label} Olarak Dönüştür`}
          </button>
        </>
      )}
    </div>
  );
}
