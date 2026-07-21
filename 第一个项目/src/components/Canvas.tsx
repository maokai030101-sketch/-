"use client";

import { CSS } from "@dnd-kit/utilities";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical, PackageOpen, Play, Plus, ShoppingBag, Star, Trash2 } from "lucide-react";
import { useBuilder } from "./BuilderContext";
import { MODULE_META, StoreModule } from "./types";

const placeholder = "linear-gradient(135deg, #dbe4ea 0%, #f4f6f7 48%, #cbd5dc 100%)";

function Media({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return src ? <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} /> : <div className={`flex h-full w-full items-center justify-center text-slate-400 ${className}`} style={{ background: placeholder }}><PackageOpen size={24} strokeWidth={1.5} /></div>;
}

function ModulePreview({ module, mobile }: { module: StoreModule; mobile: boolean }) {
  switch (module.type) {
    case "header": return <div className={`relative overflow-hidden ${mobile ? "aspect-square" : "aspect-[5/1] min-h-[150px]"}`}><Media src={mobile ? module.mobileImage || module.desktopImage : module.desktopImage} alt="顶部横幅" /><div className="absolute inset-0 bg-black/40" /><div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white"><h2 className={`${mobile ? "text-2xl" : "text-3xl"} font-bold`}>{module.title}</h2><p className="mt-2 max-w-xl text-sm text-white/90">{module.subtitle}</p><span className="mt-4 bg-white px-4 py-2 text-xs font-bold text-slate-900">{module.buttonText}</span></div></div>;
    case "heroVideo": return <div className={`relative overflow-hidden bg-slate-950 ${mobile ? "aspect-square" : "aspect-[5/1] min-h-[150px]"}`}>{mobile && module.mobileImage && <Media src={module.mobileImage} alt="移动端视频横幅备用图" />}<div className="absolute inset-0 bg-black/55" /><div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white"><span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/15 text-white"><Play size={20} fill="currentColor" /></span><h2 className={`${mobile ? "mt-4 text-2xl" : "mt-3 text-3xl"} font-bold`}>{module.title}</h2><p className="mt-2 max-w-xl text-sm text-white/90">{module.subtitle}</p><span className="mt-4 bg-white px-4 py-2 text-xs font-bold text-slate-900">{module.buttonText}</span></div></div>;
    case "logo": return <div className="flex justify-center bg-white p-8"><div className="h-28 w-28 overflow-hidden"><Media src={module.image} alt={module.alt} className="object-contain" /></div></div>;
    case "gallery": return <div className="bg-white p-4"><div className="hide-scrollbar flex snap-x gap-3 overflow-x-auto">{module.images.map((item) => <div key={item.id} className={`${mobile ? "min-w-[88%]" : "min-w-[48%]"} aspect-square snap-center overflow-hidden`}><Media src={item.image} alt={item.alt} /></div>)}</div><div className="mt-3 flex justify-center gap-1.5">{module.images.map((item, i) => <span key={item.id} className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-slate-800" : "bg-slate-300"}`} />)}</div></div>;
    case "shoppable": return <div className="relative aspect-square overflow-hidden"><Media src={module.image} alt="可购物场景图" />{module.hotspots.map((spot) => <span key={spot.id} title={spot.asin} className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-slate-900/80 text-white shadow" style={{ left: `${spot.x}%`, top: `${spot.y}%` }}><Plus size={14} /></span>)}</div>;
    case "productGrid": return <div className="bg-white p-4"><div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${mobile ? Math.min(2, module.columns) : Math.min(5, module.columns)}, minmax(0, 1fr))` }}>{module.products.map((product) => <div key={product.id} className="min-w-0"><div className="aspect-square overflow-hidden bg-slate-100"><Media src={product.image} alt={product.name} /></div><p className="mt-2 truncate text-xs font-semibold">{product.name}</p><p className="mt-1 text-sm font-bold">{product.price}</p></div>)}</div></div>;
    case "collection": return <div className={`grid bg-white ${mobile ? "grid-cols-1" : "grid-cols-[1.15fr_1fr]"}`}><div className="aspect-square overflow-hidden"><Media src={module.cover} alt={module.title} /></div><div className="flex flex-col justify-center p-6"><p className="text-xl font-bold">{module.title}</p><div className="mt-4 space-y-3">{module.products.map((product) => <div key={product.id} className="flex items-center gap-3"><div className="h-12 w-12 shrink-0 overflow-hidden"><Media src={product.image} alt={product.name} /></div><div className="min-w-0"><p className="truncate text-xs font-semibold">{product.name}</p><p className="text-xs font-bold">{product.price}</p></div></div>)}</div></div></div>;
    case "bestSellers":
    case "featuredDeals": return <div className="bg-white p-6"><h3 className="mb-4 text-center text-xl font-bold">{module.title}</h3><div className={`grid gap-3 ${mobile ? "grid-cols-1" : "grid-cols-2"}`}>{module.products.map((product, i) => <div key={product.id} className="relative flex items-center gap-3 border border-slate-200 p-3">{module.type === "featuredDeals" && module.badgeText && <span className="absolute right-2 top-2 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{module.badgeText}</span>}<span className="text-2xl font-bold text-slate-300">{i + 1}</span><div className="min-w-0 flex-1"><p className="truncate pr-14 text-xs font-semibold">{product.name}</p><div className="my-1 flex text-amazon">{Array.from({ length: 5 }).map((_, star) => <Star key={star} size={11} fill={star < product.stars ? "currentColor" : "none"} />)}</div><p className="text-sm font-bold">{product.price}</p></div></div>)}</div></div>;
    case "video": return <div className="bg-slate-900"><div className="relative aspect-video"><div className="absolute inset-0 flex flex-col items-center justify-center text-white"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg"><Play size={22} fill="currentColor" /></span><p className="mt-4 text-sm font-semibold">{module.title}</p></div></div></div>;
    case "text": return <div className="bg-white px-8 py-10 text-center"><h3 className="text-2xl font-bold">{module.title}</h3><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">{module.body}</p></div>;
    case "imageWithText": return <div className={`grid bg-white ${mobile ? "grid-cols-1" : "grid-cols-2"}`}><div className={`aspect-square overflow-hidden ${!mobile && module.layout === "right" ? "order-2" : ""}`}><Media src={module.image} alt={module.title} /></div><div className={`flex flex-col justify-center p-8 ${!mobile && module.layout === "right" ? "order-1" : ""}`}><h3 className="text-2xl font-bold">{module.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{module.body}</p><span className="mt-5 w-fit bg-slate-900 px-4 py-2 text-xs font-bold text-white">{module.buttonText}</span></div></div>;
    case "testimonial": return <div className={`flex items-center justify-center gap-6 bg-slate-50 px-8 py-10 ${mobile ? "flex-col text-center" : ""}`}><div className="h-20 w-20 shrink-0 overflow-hidden rounded-full"><Media src={module.avatar} alt={module.name} /></div><div className="max-w-lg"><p className="text-lg leading-7 text-slate-700">“{module.text}”</p><p className="mt-2 text-xs font-bold uppercase text-slate-500">{module.name}</p></div></div>;
    case "categoryTiles": return <div className="bg-white p-4"><div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${mobile ? Math.min(2, module.columns) : module.columns}, minmax(0, 1fr))` }}>{module.tiles.map((tile) => <div key={tile.id} className="overflow-hidden rounded border border-slate-200"><div className="aspect-square"><Media src={tile.image} alt={tile.name} /></div><div className="flex items-center justify-between p-3"><p className="truncate text-xs font-bold">{tile.name}</p><ShoppingBag size={13} /></div></div>)}</div></div>;
  }
}

function SortableModule({ module }: { module: StoreModule }) {
  const { selectedId, selectModule, removeModule, previewMode } = useBuilder();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: module.id });
  const selected = selectedId === module.id;
  return <section ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} onClick={() => selectModule(module.id)} className={`group relative border transition ${selected ? "border-sky-500 ring-2 ring-sky-200" : "border-slate-200 hover:border-slate-400"} ${isDragging ? "z-20 opacity-60" : ""}`}>
    <div className={`absolute right-2 top-2 z-10 flex gap-1 transition ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}><button {...attributes} {...listeners} onClick={(e) => e.stopPropagation()} className="icon-button cursor-grab shadow-sm" title="拖动排序"><GripVertical size={14} /></button><button onClick={(e) => { e.stopPropagation(); removeModule(module.id); }} className="icon-button text-red-600 shadow-sm hover:text-red-700" title="删除模块"><Trash2 size={14} /></button></div>
    <ModulePreview module={module} mobile={previewMode === "mobile"} />
  </section>;
}

function BannerModule({ module }: { module: StoreModule }) {
  const { selectedId, selectModule, removeModule, previewMode } = useBuilder();
  const selected = selectedId === module.id;
  return <section onClick={() => selectModule(module.id)} className={`group relative border transition ${selected ? "border-sky-500 ring-2 ring-sky-200" : "border-slate-200 hover:border-slate-400"}`}>
    <button onClick={(event) => { event.stopPropagation(); removeModule(module.id); }} className={`icon-button absolute right-2 top-2 z-10 text-red-600 shadow-sm transition ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} title="删除横幅"><Trash2 size={14} /></button>
    <ModulePreview module={module} mobile={previewMode === "mobile"} />
  </section>;
}

export function Canvas() {
  const { modules, pages, activePageId, storeSettings, previewMode, reorderModules, hydrated, selectModule, selectPage } = useBuilder();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const onDragEnd = ({ active, over }: DragEndEvent) => { if (over && active.id !== over.id) reorderModules(String(active.id), String(over.id)); };
  const banners = modules.filter((module) => module.type === "header" || module.type === "heroVideo");
  const contentModules = modules.filter((module) => module.type !== "header" && module.type !== "heroVideo");
  return <div className="min-w-0 overflow-auto bg-slate-100 p-7" onClick={() => selectModule(null)}>
    <div id="store-canvas" onClick={(e) => e.stopPropagation()} className={`mx-auto min-h-full overflow-hidden bg-white shadow-canvas transition-[width] duration-200 ${previewMode === "mobile" ? "w-[375px]" : "w-full max-w-[1120px]"}`}>
      {!hydrated ? <div className="flex h-72 items-center justify-center text-sm text-slate-400">正在载入项目…</div> : <>
        {banners.map((module) => <BannerModule key={module.id} module={module} />)}
        <nav className="flex min-h-16 items-center gap-4 overflow-x-auto border-b-2 border-slate-200 bg-white px-5 text-xs font-semibold text-slate-600">
          <div className="mr-2 flex shrink-0 items-center gap-2.5 text-slate-900"><div className="flex h-10 w-10 items-center justify-center overflow-hidden bg-slate-800 text-sm font-bold text-white">{storeSettings.logo ? <img src={storeSettings.logo} alt={storeSettings.brandName} className="h-full w-full object-cover" /> : "店"}</div><div className="flex flex-col gap-1"><span className="max-w-24 truncate text-xs font-bold">{storeSettings.brandName}</span><button className="h-6 rounded border border-slate-300 bg-slate-50 px-2 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-100">{storeSettings.followText}</button></div></div>
          {pages.map((page) => <button key={page.id} onClick={() => selectPage(page.id)} className={`h-12 shrink-0 border-b-2 px-0.5 transition ${page.id === activePageId ? "border-sky-600 text-sky-700" : "border-transparent hover:border-slate-300 hover:text-slate-900"}`}>{page.title}</button>)}
        </nav>
        {contentModules.length === 0 ? <div className="flex h-[420px] flex-col items-center justify-center px-8 text-center"><div className="flex h-14 w-14 items-center justify-center rounded bg-slate-100 text-slate-500"><PackageOpen size={24} /></div><h2 className="mt-4 text-lg font-bold">此页面还没有内容模块</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">从左侧模块库添加内容；横幅模块将自动显示在导航栏上方。</p></div> : <DndContext sensors={sensors} onDragEnd={onDragEnd}><SortableContext items={contentModules.map((module) => module.id)} strategy={verticalListSortingStrategy}><div className="space-y-2 bg-slate-100 p-2">{contentModules.map((module) => <SortableModule key={module.id} module={module} />)}</div></SortableContext></DndContext>}
      </>}
    </div>
  </div>;
}
