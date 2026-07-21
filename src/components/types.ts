export type ModuleType =
  | "header" | "heroVideo" | "logo" | "gallery" | "shoppable" | "productGrid"
  | "collection" | "bestSellers" | "featuredDeals" | "video" | "text" | "imageWithText" | "testimonial" | "categoryTiles";

export type ImageItem = { id: string; image: string; alt: string };
export type Product = { id: string; image: string; name: string; price: string; asin: string };
export type Hotspot = { id: string; x: number; y: number; asin: string };
export type Seller = { id: string; name: string; price: string; stars: number; asin: string };
export type Tile = { id: string; image: string; name: string; link: string };

export type HeaderModule = { id: string; type: "header"; title: string; subtitle: string; buttonText: string; buttonLink: string; desktopImage: string; mobileImage: string };
export type HeroVideoModule = { id: string; type: "heroVideo"; videoUrl: string; mobileImage: string; title: string; subtitle: string; buttonText: string };
export type LogoModule = { id: string; type: "logo"; image: string; alt: string };
export type GalleryModule = { id: string; type: "gallery"; images: ImageItem[] };
export type ShoppableModule = { id: string; type: "shoppable"; image: string; hotspots: Hotspot[] };
export type ProductGridModule = { id: string; type: "productGrid"; columns: number; products: Product[] };
export type CollectionModule = { id: string; type: "collection"; cover: string; title: string; products: Product[] };
export type BestSellersModule = { id: string; type: "bestSellers"; title: string; products: Seller[] };
export type FeaturedDealsModule = { id: string; type: "featuredDeals"; title: string; badgeText: string; products: Seller[] };
export type VideoModule = { id: string; type: "video"; url: string; title: string };
export type TextModule = { id: string; type: "text"; title: string; body: string };
export type ImageWithTextModule = { id: string; type: "imageWithText"; image: string; title: string; body: string; buttonText: string; layout: "left" | "right" };
export type TestimonialModule = { id: string; type: "testimonial"; avatar: string; name: string; text: string };
export type CategoryTilesModule = { id: string; type: "categoryTiles"; columns: number; tiles: Tile[] };

export type StoreModule = HeaderModule | HeroVideoModule | LogoModule | GalleryModule | ShoppableModule | ProductGridModule | CollectionModule | BestSellersModule | FeaturedDealsModule | VideoModule | TextModule | ImageWithTextModule | TestimonialModule | CategoryTilesModule;
export type StorePage = { id: string; title: string; modules: StoreModule[] };
export type StorefrontSettings = { logo: string; brandName: string; followText: string };
export type PreviewMode = "desktop" | "mobile";

export const uid = () => typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

export const MODULE_META: Record<ModuleType, { label: string; description: string }> = {
  header: { label: "顶部横幅", description: "响应式主视觉横幅" },
  heroVideo: { label: "视频横幅", description: "带视频背景的主视觉" },
  logo: { label: "品牌标志", description: "方形品牌图标" },
  gallery: { label: "图片画廊", description: "可滚动图片轮播" },
  shoppable: { label: "可购物图片", description: "带商品热点的图片" },
  productGrid: { label: "商品网格", description: "每行最多展示 5 个商品" },
  collection: { label: "商品合集", description: "封面与商品清单" },
  bestSellers: { label: "热销榜单", description: "热门商品卡片" },
  featuredDeals: { label: "精选优惠", description: "带促销角标的优惠卡片" },
  video: { label: "视频", description: "YouTube 16:9 播放器" },
  text: { label: "文字内容", description: "标题与正文文案" },
  imageWithText: { label: "图文模块", description: "左右分栏图文展示" },
  testimonial: { label: "用户评价", description: "顾客推荐语" },
  categoryTiles: { label: "分类磁贴", description: "带链接的分类图片" },
};

export function createModule(type: ModuleType): StoreModule {
  const id = uid();
  const product = (name = "日常精选"): Product => ({ id: uid(), image: "", name, price: "¥199", asin: "B0EXAMPLE" });
  switch (type) {
    case "header": return { id, type, title: "为日常生活而设计", subtitle: "简约实用的生活好物，陪伴每一个日常瞬间。", buttonText: "探索精选系列", buttonLink: "#", desktopImage: "", mobileImage: "" };
    case "heroVideo": return { id, type, videoUrl: "", mobileImage: "", title: "看见生活的更多可能", subtitle: "以动态影像，讲述每一件好物背后的故事。", buttonText: "立即探索" };
    case "logo": return { id, type, image: "", alt: "品牌标志" };
    case "gallery": return { id, type, images: [{ id: uid(), image: "", alt: "画廊图片 1" }, { id: uid(), image: "", alt: "画廊图片 2" }] };
    case "shoppable": return { id, type, image: "", hotspots: [{ id: uid(), x: 30, y: 42, asin: "B0EXAMPLE" }] };
    case "productGrid": return { id, type, columns: 5, products: [product("帆布托特包"), product("随行水杯"), product("柔软盖毯"), product("桌面收纳盒"), product("轻量旅行包")] };
    case "collection": return { id, type, cover: "", title: "周末出行精选", products: [product("周末托特包"), product("旅行收纳包")] };
    case "bestSellers": return { id, type, title: "顾客热爱之选", products: [{ id: uid(), name: "日常收纳盒", price: "¥169", stars: 5, asin: "B0EXAMPLE" }, { id: uid(), name: "经典随行杯", price: "¥129", stars: 4, asin: "B0EXAMPLE2" }] };
    case "featuredDeals": return { id, type, title: "限时精选优惠", badgeText: "限时优惠", products: [{ id: uid(), name: "旅行收纳套装", price: "¥159", stars: 5, asin: "B0EXAMPLE" }, { id: uid(), name: "轻量随行包", price: "¥229", stars: 4, asin: "B0EXAMPLE2" }] };
    case "video": return { id, type, url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "探索系列的更多细节" };
    case "text": return { id, type, title: "为美好生活而生", body: "真正实用的物品，应当设计周到、使用舒适，并自然融入你的日常空间。" };
    case "imageWithText": return { id, type, image: "", title: "把美好带进日常", body: "从材质到细节，我们用心打磨每一次体验，让平凡的日子也充满质感。", buttonText: "了解更多", layout: "left" };
    case "testimonial": return { id, type, avatar: "", name: "周女士", text: "拿到手就能感受到细节和质感，现在已经成了我每天都会使用的好物。" };
    case "categoryTiles": return { id, type, columns: 3, tiles: [{ id: uid(), image: "", name: "居家生活", link: "#" }, { id: uid(), image: "", name: "出行旅行", link: "#" }, { id: uid(), image: "", name: "精选配件", link: "#" }] };
  }
}
