"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { createModule, ModuleType, PreviewMode, StoreModule, StorePage, StorefrontSettings, uid } from "./types";

const STORAGE_KEY = "storefront-studio-project";

type BuilderContextValue = {
  modules: StoreModule[];
  pages: StorePage[];
  activePage: StorePage | null;
  activePageId: string | null;
  storeSettings: StorefrontSettings;
  selectedId: string | null;
  selectedModule: StoreModule | null;
  previewMode: PreviewMode;
  hydrated: boolean;
  addModule: (type: ModuleType) => void;
  removeModule: (id: string) => void;
  selectModule: (id: string | null) => void;
  updateModule: (id: string, patch: Partial<StoreModule>) => void;
  reorderModules: (activeId: string, overId: string) => void;
  addPage: () => void;
  removePage: (id: string) => void;
  renamePage: (id: string, title: string) => void;
  selectPage: (id: string) => void;
  updateStoreSettings: (patch: Partial<StorefrontSettings>) => void;
  setPreviewMode: (mode: PreviewMode) => void;
};

const BuilderContext = createContext<BuilderContextValue | null>(null);
const createPage = (title: string, modules: StoreModule[] = []): StorePage => ({ id: uid(), title, modules });
const defaultStoreSettings: StorefrontSettings = { logo: "", brandName: "北境生活", followText: "关注" };

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<StorePage[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [storeSettings, setStoreSettings] = useState<StorefrontSettings>(defaultStoreSettings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { pages?: StorePage[]; activePageId?: string; modules?: StoreModule[]; previewMode?: PreviewMode; storeSettings?: Partial<StorefrontSettings> };
        const restoredPages = Array.isArray(parsed.pages) && parsed.pages.length > 0
          ? parsed.pages
          : Array.isArray(parsed.modules) ? [createPage("首页", parsed.modules)] : [createPage("首页")];
        setPages(restoredPages);
        setActivePageId(restoredPages.some((page) => page.id === parsed.activePageId) ? parsed.activePageId ?? null : restoredPages[0].id);
        if (parsed.storeSettings) setStoreSettings({ ...defaultStoreSettings, ...parsed.storeSettings });
        if (parsed.previewMode === "desktop" || parsed.previewMode === "mobile") setPreviewMode(parsed.previewMode);
      } else {
        const firstPage = createPage("首页");
        setPages([firstPage]);
        setActivePageId(firstPage.id);
      }
    } catch {
      const firstPage = createPage("首页");
      setPages([firstPage]);
      setActivePageId(firstPage.id);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || pages.length === 0) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ pages, activePageId, previewMode, storeSettings })); } catch { /* Large base64 images can exceed browser quota. */ }
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [pages, activePageId, previewMode, storeSettings, hydrated]);

  const updateActiveModules = useCallback((updater: (modules: StoreModule[]) => StoreModule[]) => {
    if (!activePageId) return;
    setPages((current) => current.map((page) => page.id === activePageId ? { ...page, modules: updater(page.modules) } : page));
  }, [activePageId]);

  const addModule = useCallback((type: ModuleType) => {
    const next = createModule(type);
    updateActiveModules((current) => [...current, next]);
    setSelectedId(next.id);
  }, [updateActiveModules]);

  const removeModule = useCallback((id: string) => {
    updateActiveModules((current) => current.filter((module) => module.id !== id));
    setSelectedId((current) => current === id ? null : current);
  }, [updateActiveModules]);

  const updateModule = useCallback((id: string, patch: Partial<StoreModule>) => {
    updateActiveModules((current) => current.map((module) => module.id === id ? { ...module, ...patch } as StoreModule : module));
  }, [updateActiveModules]);

  const reorderModules = useCallback((activeId: string, overId: string) => {
    updateActiveModules((current) => {
      const from = current.findIndex((module) => module.id === activeId);
      const to = current.findIndex((module) => module.id === overId);
      return from >= 0 && to >= 0 ? arrayMove(current, from, to) : current;
    });
  }, [updateActiveModules]);

  const addPage = useCallback(() => {
    setPages((current) => {
      const next = createPage(`新页面 ${current.length + 1}`);
      setActivePageId(next.id);
      setSelectedId(null);
      return [...current, next];
    });
  }, []);

  const removePage = useCallback((id: string) => {
    setPages((current) => {
      if (current.length <= 1) return current;
      const next = current.filter((page) => page.id !== id);
      setActivePageId((active) => active === id ? next[0].id : active);
      return next;
    });
    setSelectedId(null);
  }, []);

  const renamePage = useCallback((id: string, title: string) => {
    setPages((current) => current.map((page) => page.id === id ? { ...page, title: title || "未命名页面" } : page));
  }, []);

  const selectPage = useCallback((id: string) => {
    setActivePageId(id);
    setSelectedId(null);
  }, []);

  const updateStoreSettings = useCallback((patch: Partial<StorefrontSettings>) => {
    setStoreSettings((current) => ({ ...current, ...patch }));
  }, []);

  const activePage = pages.find((page) => page.id === activePageId) ?? pages[0] ?? null;
  const modules = activePage?.modules ?? [];
  const selectedModule = modules.find((module) => module.id === selectedId) ?? null;
  const value = useMemo(() => ({ modules, pages, activePage, activePageId, storeSettings, selectedId, selectedModule, previewMode, hydrated, addModule, removeModule, selectModule: setSelectedId, updateModule, reorderModules, addPage, removePage, renamePage, selectPage, updateStoreSettings, setPreviewMode }), [modules, pages, activePage, activePageId, storeSettings, selectedId, selectedModule, previewMode, hydrated, addModule, removeModule, updateModule, reorderModules, addPage, removePage, renamePage, selectPage, updateStoreSettings]);

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) throw new Error("useBuilder must be used within BuilderProvider");
  return context;
}
