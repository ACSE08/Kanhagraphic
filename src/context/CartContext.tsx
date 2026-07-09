"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  type CartItem,
  type CartItemInput,
  buildCartItem,
  getCartTotals,
  loadCartFromStorage,
  saveCartToStorage,
} from "@/lib/cart";

interface CartContextValue {
  items: CartItem[];
  count: number;
  totals: ReturnType<typeof getCartTotals>;
  addItem: (input: CartItemInput) => { ok: true } | { ok: false; error: string };
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_EVENT = "kanha_cart_updated";
const CART_KEY = "kanha_cart";
const EMPTY_CART: CartItem[] = [];

let cachedRaw = "";
let cachedItems: CartItem[] = EMPTY_CART;

function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  const raw = window.localStorage.getItem(CART_KEY) || "";
  if (raw === cachedRaw) {
    return cachedItems;
  }

  cachedRaw = raw;

  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedItems = Array.isArray(parsed) ? (parsed as CartItem[]) : EMPTY_CART;
  } catch {
    cachedItems = EMPTY_CART;
  }

  return cachedItems;
}

function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribeToCart(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key === "kanha_cart") {
      callback();
    }
  };

  const onCartUpdated = () => callback();

  window.addEventListener("storage", onStorage);
  window.addEventListener(CART_STORAGE_EVENT, onCartUpdated);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CART_STORAGE_EVENT, onCartUpdated);
  };
}

function notifyCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_STORAGE_EVENT));
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);

  const addItem = useCallback((input: CartItemInput) => {
    const built = buildCartItem(input);
    if ("error" in built) {
      return { ok: false as const, error: built.error };
    }
    const nextItems = [...loadCartFromStorage(), built];
    saveCartToStorage(nextItems);
    notifyCartUpdated();
    return { ok: true as const };
  }, []);

  const removeItem = useCallback((id: string) => {
    const nextItems = loadCartFromStorage().filter((i) => i.id !== id);
    saveCartToStorage(nextItems);
    notifyCartUpdated();
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const nextItems = loadCartFromStorage().map((item) => {
      if (item.id !== id) return item;
      const rebuilt = buildCartItem({
        serviceType: item.serviceType,
        productName: item.productName,
        quantity,
        notes: item.notes,
        labelLayout: item.labelLayout,
        insertType: item.insertType,
      });
      if ("error" in rebuilt) return item;
      return { ...rebuilt, id: item.id, addedAt: item.addedAt };
    });

    saveCartToStorage(nextItems);
    notifyCartUpdated();
  }, []);

  const clearCart = useCallback(() => {
    saveCartToStorage([]);
    notifyCartUpdated();
  }, []);

  const totals = useMemo(() => getCartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, totals, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
