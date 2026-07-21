"use client";

import { BadgePercent, Clapperboard, Image, Images, LayoutGrid, LayoutTemplate, MessageSquareQuote, MousePointer2, PackageOpen, PanelsTopLeft, PlaySquare, Plus, ShoppingBag, Sparkles, Type } from "lucide-react";
import { useBuilder } from "./BuilderContext";
import { MODULE_META, ModuleType } from "./types";

const items: { type: ModuleType; icon: typeof Image }[] = [
  { type: "header", icon: LayoutTemplate }, { type: "heroVideo", icon: Clapperboard }, { type: "logo", icon: Image }, { type: "gallery", icon: Images },
  { type: "shoppable", icon: MousePointer2 }, { type: "productGrid", icon: LayoutGrid }, { type: "collection", icon: PackageOpen },
  { type: "bestSellers", icon: Sparkles }, { type: "featuredDeals", icon: BadgePercent }, { type: "video", icon: PlaySquare }, { type: "text", icon: Type }, { type: "imageWithText", icon: PanelsTopLeft },
  { type: "testimonial", icon: MessageSquareQuote }, { type: "categoryTiles", icon: ShoppingBag },
];

export function ModuleLibrary() {
  const { addModule } = useBuilder();
  return (
    <aside className="min-h-0 overflow-y-auto border-r border-slate-200 bg-white p-4">
      <div className="mb-4">
        <p className="panel-title">模块库</p>
        <p className="mt-1 text-xs text-slate-400">添加店铺内容模块</p>
      </div>
      <div className="space-y-1.5">
        {items.map(({ type, icon: Icon }) => (
          <div key={type} className="group flex items-center gap-2.5 rounded border border-transparent p-2 transition hover:border-slate-200 hover:bg-slate-50">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-600"><Icon size={16} /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">{MODULE_META[type].label}</p>
              <p className="truncate text-[10px] text-slate-400">{MODULE_META[type].description}</p>
            </div>
            <button className="icon-button h-7 w-7" onClick={() => addModule(type)} aria-label={`添加${MODULE_META[type].label}`} title={`添加${MODULE_META[type].label}`}><Plus size={14} /></button>
          </div>
        ))}
      </div>
    </aside>
  );
}
