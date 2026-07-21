"use client";

import { BuilderProvider } from "@/components/BuilderContext";
import { Canvas } from "@/components/Canvas";
import { ModuleLibrary } from "@/components/ModuleLibrary";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { Toolbar } from "@/components/Toolbar";

export default function Home() {
  return (
    <BuilderProvider>
      <main className="flex h-screen min-h-[640px] flex-col overflow-hidden bg-slate-100 text-slate-900">
        <Toolbar />
        <div className="grid min-h-0 flex-1 grid-cols-[248px_minmax(420px,1fr)_320px]">
          <ModuleLibrary />
          <Canvas />
          <PropertiesPanel />
        </div>
      </main>
    </BuilderProvider>
  );
}
