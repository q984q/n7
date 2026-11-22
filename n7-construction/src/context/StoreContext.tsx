"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { PRODUCTS, Product, orderQuantity, getTierPrice } from "@/data/products";
import { SITE_CONFIG } from "@/config/site";
import { trackEvent, trackProductEvent } from "@/lib/analytics";

export interface CartItem {
  lineKey: string;
  productId: string;
  qty: number;
  includeInstall: boolean;
  optionsNote?: string;
}

export interface EnrichedCartItem extends CartItem {
  product: Product;
  unitPrice: number;
  baseUnitPrice: number;
  materialTotal: number;
  installTotal: number;
  lineTotal: number;
  discountSaved: number;
}

export interface LeadModalState {
  open: boolean;
  title?: string;
  subtitle?: string;
  source?: string;
  contextSummary?: string;
}

export interface LiveSettings {
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  workingHours: string;
  bin: string;
  iik: string;
  bank: string;
  promoBannerActive: boolean;
  promoBannerText: string;
}

interface ToastItem {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface StoreContextValue {
  hydrated: boolean;
  liveProducts: Product[];
  liveSettings: LiveSettings;
  refreshCms: () => Promise<void>;

  cart: EnrichedCartItem[];
  cartCount: number;
  isInCart: (productId: string) => boolean;
  materialSubtotal: number;
  installSubtotal: number;
  totalSavings: number;
  grandTotal: number;
  vatIncludedAmount: number;
  addToCart: (
    productId: string,
    qty?: number,
    includeInstall?: boolean,
    openDrawer?: boolean,
    optionsNote?: string
  ) => void;
  updateQty: (lineKey: string, qty: number) => void;
  toggleInstall: (lineKey: string) => void;
  removeFromCart: (lineKey: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  compareIds: string[];
  compareProducts: Product[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;

  leadModal: LeadModalState;
  openLeadModal: (opts?: Omit<LeadModalState, "open">) => void;
  closeLeadModal: () => void;

  toasts: ToastItem[];
  pushToast: (
    message: string,
    actionLabel?: string,
    onAction?: () => void
  ) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "n7_cart_v3";
const COMPARE_KEY = "n7_compare_v2";

const DEFAULT_LIVE_SETTINGS: LiveSettings = {
  phone: SITE_CONFIG.phone,
  whatsappNumber: SITE_CONFIG.whatsappNumber,
  email: SITE_CONFIG.email,
  address: SITE_CONFIG.address,
  workingHours: SITE_CONFIG.workingHours,
  bin: SITE_CONFIG.bin,
  iik: SITE_CONFIG.iik,
  bank: SITE_CONFIG.bank,
  promoBannerActive: false,
  promoBannerText: "",
};

function makeLineKey(productId: string, optionsNote?: string): string {
  const clean = (optionsNote || "").trim();
  return clean ? `${productId}::${clean}` : productId;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [liveProducts, setLiveProducts] = useState<Product[]>(PRODUCTS);
  const [liveSettings, setLiveSettings] = useState<LiveSettings>(
    DEFAULT_LIVE_SETTINGS
  );
  const [rawCart, setRawCart] = useState<CartItem[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [leadModal, setLeadModal] = useState<LeadModalState>({ open: false });
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const refreshCms = useCallback(async () => {
    try {
      const res = await fetch("/api/cms", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        setLiveProducts(data.products);
      }
      if (data.settings) {
        setLiveSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch {
      // keep static fallback
    }
  }, []);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setRawCart(
            parsed.map((item) => ({
              ...item,
              lineKey:
                item.lineKey || makeLineKey(item.productId, item.optionsNote),
            }))
          );
        }
      }
      const savedCompare = localStorage.getItem(COMPARE_KEY);
      if (savedCompare) {
        const parsed = JSON.parse(savedCompare);
        if (Array.isArray(parsed)) setCompareIds(parsed);
      }
    } catch {
      // ignore storage errors
    }
    setHydrated(true);
    refreshCms();
  }, [refreshCms]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(rawCart));
    } catch {
      // ignore
    }
  }, [rawCart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(compareIds));
    } catch {
      // ignore
    }
  }, [compareIds, hydrated]);

  const pushToast = useCallback(
    (message: string, actionLabel?: string, onAction?: () => void) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [
        ...prev.slice(-2),
        { id, message, actionLabel, onAction },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3400);
    },
    []
  );

  const openCart = useCallback(() => {
    setIsCartOpen(true);
    trackEvent("begin_checkout", { item_count: rawCart.length });
  }, [rawCart.length]);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback(
    (
      productId: string,
      qty?: number,
      includeInstall = false,
      openDrawer = false,
      optionsNote?: string
    ) => {
      const product =
        liveProducts.find((p) => p.id === productId) ||
        PRODUCTS.find((p) => p.id === productId);
      if (!product) return;
      const addAmount = orderQuantity(product, qty ?? product.minOrder);
      const cleanNote = (optionsNote || "").trim() || undefined;
      const lineKey = makeLineKey(productId, cleanNote);

      setRawCart((prev) => {
        const existing = prev.find((i) => i.lineKey === lineKey);
        if (existing) {
          return prev.map((i) =>
            i.lineKey === lineKey
              ? {
                  ...i,
                  qty: orderQuantity(product, i.qty + addAmount),
                  includeInstall: includeInstall || i.includeInstall,
                }
              : i
          );
        }
        return [
          ...prev,
          {
            lineKey,
            productId,
            qty: Math.max(1, addAmount),
            includeInstall,
            ...(cleanNote ? { optionsNote: cleanNote } : {}),
          },
        ];
      });

      trackProductEvent("add_to_cart", product, addAmount);
      if (openDrawer) {
        setIsCartOpen(true);
      } else {
        pushToast(`В списке КП: ${product.shortName}`, "Открыть", () =>
          setIsCartOpen(true)
        );
      }
    },
    [pushToast, liveProducts]
  );

  const updateQty = useCallback((lineKey: string, qty: number) => {
    if (qty <= 0) {
      setRawCart((prev) =>
        prev.filter((i) => i.lineKey !== lineKey && i.productId !== lineKey)
      );
      return;
    }
    setRawCart((prev) =>
      prev.map((i) =>
        i.lineKey === lineKey || i.productId === lineKey
          ? { ...i, qty: orderQuantity(liveProducts.find(p => p.id === i.productId) || {minOrder:1,stepQty:1}, qty) }
          : i
      )
    );
  }, [liveProducts]);

  const toggleInstall = useCallback((lineKey: string) => {
    setRawCart((prev) =>
      prev.map((i) =>
        i.lineKey === lineKey ? { ...i, includeInstall: !i.includeInstall } : i
      )
    );
  }, []);

  const removeFromCart = useCallback((lineKey: string) => {
    setRawCart((prev) =>
      prev.filter((i) => i.lineKey !== lineKey && i.productId !== lineKey)
    );
  }, []);

  const clearCart = useCallback(() => {
    setRawCart([]);
  }, []);

  const inCartProductIds = useMemo(
    () => new Set(rawCart.map((i) => i.productId)),
    [rawCart]
  );

  const isInCart = useCallback(
    (productId: string) => inCartProductIds.has(productId),
    [inCartProductIds]
  );

  const toggleCompare = useCallback(
    (productId: string) => {
      const product =
        liveProducts.find((p) => p.id === productId) ||
        PRODUCTS.find((p) => p.id === productId);
      if (!product) return;
      setCompareIds((prev) => {
        if (prev.includes(productId)) {
          trackEvent("compare_remove", { item_id: productId, item_sku: product.sku });
          pushToast(`Убрано из сравнения: ${product.shortName}`);
          return prev.filter((id) => id !== productId);
        }
        if (prev.length >= 4) {
          pushToast("До 4 позиций — заменили первую");
          return [...prev.slice(1), productId];
        }
        trackEvent("compare_add", { item_id: productId, item_sku: product.sku });
        pushToast(`В сравнении: ${product.shortName}`);
        return [...prev, productId];
      });
    },
    [pushToast, liveProducts]
  );

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const openLeadModal = useCallback((opts?: Omit<LeadModalState, "open">) => {
    setLeadModal({
      open: true,
      title: opts?.title || "Получить расчёт",
      subtitle: opts?.subtitle,
      source: opts?.source || "Сайт N7 CONSTRUCTION",
      contextSummary: opts?.contextSummary,
    });
  }, []);

  const closeLeadModal = useCallback(() => {
    setLeadModal((prev) => ({ ...prev, open: false }));
  }, []);

  const cart = useMemo<EnrichedCartItem[]>(() => {
    return rawCart
      .map((item) => {
        const product =
          liveProducts.find((p) => p.id === item.productId) ||
          PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return null;
        const tier = getTierPrice(product, item.qty);
        const unitPrice = tier.unitPrice;
        const baseUnitPrice = product.price;
        const materialTotal = unitPrice * item.qty;
        const installTotal =
          item.includeInstall && product.installPrice > 0
            ? product.installPrice * item.qty
            : 0;
        const lineTotal = materialTotal + installTotal;
        const discountSaved = Math.max(0, (baseUnitPrice - unitPrice) * item.qty);
        return {
          ...item,
          product,
          unitPrice,
          baseUnitPrice,
          materialTotal,
          installTotal,
          lineTotal,
          discountSaved,
        };
      })
      .filter((x): x is EnrichedCartItem => x !== null);
  }, [rawCart, liveProducts]);

  const materialSubtotal = useMemo(
    () => cart.reduce((acc, i) => acc + i.materialTotal, 0),
    [cart]
  );
  const installSubtotal = useMemo(
    () => cart.reduce((acc, i) => acc + i.installTotal, 0),
    [cart]
  );
  const totalSavings = useMemo(
    () => cart.reduce((acc, i) => acc + i.discountSaved, 0),
    [cart]
  );
  const grandTotal = materialSubtotal + installSubtotal;
  const vatIncludedAmount =
    grandTotal > 0 ? Math.round((grandTotal * 12) / 112) : 0;

  const compareProducts = useMemo(
    () =>
      compareIds
        .map(
          (id) =>
            liveProducts.find((p) => p.id === id) ||
            PRODUCTS.find((p) => p.id === id)
        )
        .filter((p): p is Product => Boolean(p)),
    [compareIds, liveProducts]
  );

  const value: StoreContextValue = {
    hydrated,
    liveProducts,
    liveSettings,
    refreshCms,
    cart,
    cartCount: cart.length,
    isInCart,
    materialSubtotal,
    installSubtotal,
    totalSavings,
    grandTotal,
    vatIncludedAmount,
    addToCart,
    updateQty,
    toggleInstall,
    removeFromCart,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    compareIds,
    compareProducts,
    toggleCompare,
    clearCompare,
    leadModal,
    openLeadModal,
    closeLeadModal,
    toasts,
    pushToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
