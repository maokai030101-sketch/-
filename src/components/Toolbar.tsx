"use client";

import { Download, ImageDown, Laptop, Smartphone, Store } from "lucide-react";
import { useBuilder } from "./BuilderContext";

export function Toolbar() {
  const { pages, activePageId, storeSettings, previewMode, setPreviewMode } = useBuilder();

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ version: 2, pages, activePageId, storeSettings }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "店铺项目.json"; anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = async () => {
    const element = document.getElementById("store-canvas");
    if (!element) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2, useCORS: true });
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png"); anchor.download = "店铺预览.png"; anchor.click();
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded bg-ink text-white"><Store size={17} /></div><div><h1 className="text-sm font-bold">店铺搭建工作台</h1><p className="text-[10px] text-slate-400">亚马逊风格店铺编辑器</p></div></div>
      <div className="flex items-center gap-2">
        <div className="flex rounded border border-slate-200 bg-slate-100 p-0.5" aria-label="预览尺寸">
          <button onClick={() => setPreviewMode("desktop")} className={`flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-medium ${previewMode === "desktop" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}><Laptop size={14} />桌面端</button>
          <button onClick={() => setPreviewMode("mobile")} className={`flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-medium ${previewMode === "mobile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}><Smartphone size={14} />移动端</button>
        </div>
        <button onClick={exportJson} className="icon-button" title="导出 JSON" aria-label="导出 JSON"><Download size={15} /></button>
        <button onClick={exportPng} className="flex h-8 items-center gap-1.5 rounded bg-ink px-3 text-xs font-semibold text-white transition hover:bg-slate-700" title="导出 PNG 截图"><ImageDown size={14} />截图导出</button>
      </div>
    </header>
  );
}
