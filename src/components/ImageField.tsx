"use client";

import { ImageUp, Upload, X } from "lucide-react";
import { DragEvent, useRef, useState } from "react";

export function ImageField({ label, value, onChange, recommended }: { label: string; value: string; onChange: (value: string) => void; recommended: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const upload = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    upload(event.dataTransfer.files?.[0]);
  };

  return <div>
    <label className="field-label">{label}</label>
    <div className="flex gap-1.5">
      <div
        className={`flex h-[74px] min-w-0 flex-1 items-center overflow-hidden rounded border border-dashed transition ${isDragging ? "border-sky-500 bg-sky-50" : "border-slate-300 bg-slate-50"}`}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {value ? <><img src={value} alt="已选择图片" className="h-full w-16 shrink-0 object-cover" /><p className="px-3 text-xs leading-5 text-slate-500">已选择图片<br /><span className="text-[11px] text-slate-400">拖入新图片即可替换</span></p></> : <div className="flex w-full items-center justify-center gap-2 px-3 text-xs text-slate-500"><ImageUp size={16} /><span>将图片拖到这里上传</span></div>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => upload(event.target.files?.[0])} />
      <button className="icon-button h-[74px] w-10" onClick={() => inputRef.current?.click()} title="选择图片" aria-label="选择图片"><Upload size={16} /></button>
      {value && <button className="icon-button h-[74px] w-10 text-red-500" onClick={() => onChange("")} title="清除图片" aria-label="清除图片"><X size={16} /></button>}
    </div>
    <p className="field-help">建议尺寸：{recommended}。可拖拽图片上传，或点击按钮选择本地图片。</p>
  </div>;
}
