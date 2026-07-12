"use client";

import { useState, useRef } from "react";

const accentColor = "#E84545";

export default function PdfToPptxClient() {
  const [file, setFile] = useState<File | null>(null);
  const inputRef        = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function convert() {
    if (!file) return;
    // PDF → PPTX approach: render each PDF page to canvas, embed as image in PPTX
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
    const JSZip    = (await import("jszip")).default;

    const ab  = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    const numPages = pdf.numPages;

    const W = 9144000; // 10 inches in EMU
    const H = 6858000; // 7.5 inches in EMU
    const PX_W = 1280;
    const PX_H = 960;

    const zip = new JSZip();

    // Content types
    const imgRels: string[] = [];
    const slideIds: string[] = [];
    const mediaFiles: { name: string; data: Uint8Array }[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page     = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: PX_W / page.getViewport({ scale: 1 }).width });
      const canvas   = document.createElement("canvas");
      canvas.width   = PX_W;
      canvas.height  = Math.round(viewport.height);
      await page.render({ canvas, viewport }).promise;

      const imgDataUrl  = canvas.toDataURL("image/jpeg", 0.9);
      const base64      = imgDataUrl.split(",")[1];
      const imgBytes    = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const imgName     = `image${i}.jpg`;
      mediaFiles.push({ name: imgName, data: imgBytes });

      const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
       xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${W}" cy="${H}"/><a:chOff x="0" y="0"/><a:chExt cx="${W}" cy="${H}"/></a:xfrm></p:grpSpPr>
    <p:pic>
      <p:nvPicPr><p:cNvPr id="2" name="img${i}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr>
      <p:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
      <p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${W}" cy="${H}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
    </p:pic>
  </p:spTree></p:cSld>
</p:sld>`;

      const slideRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/${imgName}"/>
</Relationships>`;

      zip.file(`ppt/slides/slide${i}.xml`, slideXml);
      zip.file(`ppt/slides/_rels/slide${i}.xml.rels`, slideRels);
      slideIds.push(`<p:sldId id="${255+i}" r:id="rId${i}"/>`);
      imgRels.push(`<Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`);
    }

    for (const { name, data } of mediaFiles) {
      zip.file(`ppt/media/${name}`, data);
    }

    const slideRelsInPres = Array.from({length:numPages},(_,i)=>
      `<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i+1}.xml"/>`
    ).join("");

    const presXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:sldMasterIdLst/>
  <p:sldIdLst>${slideIds.join("")}</p:sldIdLst>
  <p:sldSz cx="${W}" cy="${H}" type="screen4x3"/>
  <p:notesSz cx="${H}" cy="${W}"/>
</p:presentation>`;

    const presRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${slideRelsInPres}
</Relationships>`;

    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"  ContentType="application/xml"/>
  <Default Extension="jpg"  ContentType="image/jpeg"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  ${imgRels.join("")}
</Types>`;

    const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;

    zip.file("[Content_Types].xml", contentTypes);
    zip.file("_rels/.rels", rootRels);
    zip.file("ppt/presentation.xml", presXml);
    zip.file("ppt/_rels/presentation.xml.rels", presRels);

    const blob = await zip.generateAsync({ type:"blob", mimeType:"application/vnd.openxmlformats-officedocument.presentationml.presentation" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = file.name.replace(/\.pdf$/i,"")+".pptx";
    a.click();
    URL.revokeObjectURL(url);
  }

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]   = useState("");
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");

  const surface2 = "var(--color-surface)";
  const border2  = "var(--color-border)";
  const textPri2 = "var(--color-text)";
  const textSec2 = "var(--color-text-2)";
  const textTer2 = "var(--color-text-3)";

  async function handleConvert() {
    if (!file) return;
    setLoading(true); setError(""); setDone(false); setProgress(5); setStatus("PDF sayfaları işleniyor…");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
      const JSZip    = (await import("jszip")).default;

      const ab  = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
      const numPages = pdf.numPages;

      const W = 9144000;
      const H = 6858000;
      const PX_W = 1280;

      const zip         = new JSZip();
      const imgRels2: string[] = [];
      const slideIds2:  string[] = [];

      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round((i / numPages) * 80) + 10);
        setStatus(`Sayfa ${i}/${numPages} işleniyor…`);

        const page     = await pdf.getPage(i);
        const scale    = PX_W / page.getViewport({ scale: 1 }).width;
        const viewport = page.getViewport({ scale });
        const canvas   = document.createElement("canvas");
        canvas.width   = PX_W;
        canvas.height  = Math.round(viewport.height);
        await page.render({ canvas, viewport }).promise;

        const imgDataUrl  = canvas.toDataURL("image/jpeg", 0.9);
        const base64      = imgDataUrl.split(",")[1];
        const imgBytes    = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const imgName     = `image${i}.jpg`;
        zip.file(`ppt/media/${imgName}`, imgBytes);

        const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
       xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${W}" cy="${H}"/><a:chOff x="0" y="0"/><a:chExt cx="${W}" cy="${H}"/></a:xfrm></p:grpSpPr>
    <p:pic><p:nvPicPr><p:cNvPr id="2" name="img${i}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr>
      <p:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
      <p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${W}" cy="${H}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
    </p:pic>
  </p:spTree></p:cSld>
</p:sld>`;

        const slideRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/${imgName}"/>
</Relationships>`;

        zip.file(`ppt/slides/slide${i}.xml`, slideXml);
        zip.file(`ppt/slides/_rels/slide${i}.xml.rels`, slideRels);
        slideIds2.push(`<p:sldId id="${255+i}" r:id="rId${i}"/>`);
        imgRels2.push(`<Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`);
      }

      setStatus("PPTX oluşturuluyor…"); setProgress(95);

      const slideRelsInPres = Array.from({length:numPages},(_,i)=>
        `<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i+1}.xml"/>`
      ).join("");

      zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"  ContentType="application/xml"/>
  <Default Extension="jpg"  ContentType="image/jpeg"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  ${imgRels2.join("")}
</Types>`);
      zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`);
      zip.file("ppt/presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:sldMasterIdLst/>
  <p:sldIdLst>${slideIds2.join("")}</p:sldIdLst>
  <p:sldSz cx="${W}" cy="${H}" type="screen4x3"/>
  <p:notesSz cx="${H}" cy="${W}"/>
</p:presentation>`);
      zip.file("ppt/_rels/presentation.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${slideRelsInPres}
</Relationships>`);

      const blob = await zip.generateAsync({ type:"blob", mimeType:"application/vnd.openxmlformats-officedocument.presentationml.presentation" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.name.replace(/\.pdf$/i,"")+".pptx";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true); setProgress(100); setStatus("Tamamlandı!");
    } catch (e) {
      setError("Dönüştürme başarısız: " + (e instanceof Error ? e.message : ""));
    } finally {
      setLoading(false);
      setTimeout(() => { setProgress(0); setStatus(""); }, 3000);
    }
  }

  void convert; // suppress unused warning

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1.5rem" }}>
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) setFile(f); }}
          style={{ border:`2px dashed ${border2}`,borderRadius:"16px",padding:"3rem 2rem",textAlign:"center",cursor:"pointer",background:surface2 }}
          onMouseEnter={e=>(e.currentTarget.style.borderColor=accentColor)}
          onMouseLeave={e=>(e.currentTarget.style.borderColor=border2)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin:"0 auto 1rem" }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/>
          </svg>
          <p style={{ color:textPri2,fontWeight:500,marginBottom:"0.25rem" }}>PDF dosyasını sürükle veya tıkla</p>
          <p style={{ color:textTer2,fontSize:"0.8rem" }}>Her sayfa ayrı bir slayt olarak aktarılır · Maks 50 MB</p>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display:"none" }}
            onChange={e => { const f=e.target.files?.[0]; if(f) { setFile(f); setDone(false); } }} />
        </div>
      ) : (
        <>
          <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.875rem 1rem",background:surface2,borderRadius:"12px",border:`1px solid ${border2}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ color:textPri2,fontSize:"0.875rem",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.name}</p>
              <p style={{ color:textTer2,fontSize:"0.75rem" }}>{(file.size/1024/1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setDone(false); setError(""); }} style={{ background:"none",border:"none",cursor:"pointer",color:textSec2 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div style={{ padding:"0.75rem",background:`${accentColor}0D`,borderRadius:"10px",border:`1px solid ${accentColor}30`,fontSize:"0.8rem",color:textSec2 }}>
            Her PDF sayfası ayrı bir slayta dönüştürülür. Sayfa içeriği görsel olarak PPTX'e aktarılır.
          </div>

          {error && <div style={{ padding:"0.75rem 1rem",background:`${accentColor}18`,borderRadius:"10px",color:accentColor,fontSize:"0.85rem" }}>{error}</div>}
          {done  && <div style={{ padding:"0.75rem 1rem",background:"rgba(16,185,129,0.1)",borderRadius:"10px",border:"1px solid rgba(16,185,129,0.3)",color:"#10B981",fontSize:"0.85rem" }}>PPTX dosyası oluşturuldu!</div>}

          {(loading || (progress>0 && !done)) && (
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.35rem" }}>
                <span style={{ color:textSec2,fontSize:"0.8rem" }}>{status}</span>
                <span style={{ color:textTer2,fontSize:"0.75rem" }}>{progress>0?progress+"%":""}</span>
              </div>
              <div style={{ height:"4px",background:border2,borderRadius:"4px",overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${progress}%`,background:accentColor,borderRadius:"4px",transition:"width 0.3s" }} />
              </div>
            </div>
          )}

          <button onClick={handleConvert} disabled={loading} style={{
            padding:"0.875rem",borderRadius:"12px",border:"none",background:accentColor,
            color:"#fff",cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",
            fontSize:"0.9rem",fontWeight:600,opacity:loading?0.7:1,
          }}>
            {loading ? "Dönüştürülüyor…" : "PowerPoint'e Dönüştür"}
          </button>
        </>
      )}
    </div>
  );
}
