"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatPrice, hasPrice } from "@/lib/format";

export function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cart,
    grandTotal,
    updateQty,
    removeFromCart,
    clearCart,
  } = useStore();

  useEffect(() => {
    if (!isCartOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-ink/60 p-2.5 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Список позиций для запроса КП"
    >
      <div className="flex h-full w-full max-w-md flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-ink/10">
        <div className="flex items-center justify-between border-b border-ink/[0.08] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-track" />
            <div>
              <h2 className="text-sm font-extrabold text-ink">Список для КП</h2>
              <p className="text-[11px] text-ink/50 tabular-nums">
                {cart.length} поз.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Закрыть"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink/65 hover:text-ink transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-base font-extrabold text-ink">Список пуст</p>
              <p className="text-xs text-ink/50 max-w-[230px] mx-auto">
                Добавьте позиции из каталога для общего расчёта.
              </p>
              <Link
                href="/catalog"
                onClick={closeCart}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white"
              >
                В каталог
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.lineKey}
                className="rounded-2xl bg-canvas p-3.5 ring-1 ring-ink/[0.06]"
              >
                <div className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-ink/[0.08]">
                    <Image
                      src={item.product.image}
                      alt={item.product.shortName}
                      fill
                      sizes="56px"
                      className={
                        item.product.category === "lighting"
                          ? "object-contain p-1.5"
                          : "object-cover"
                      }
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/catalog/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-xs font-extrabold text-ink hover:text-track line-clamp-2"
                      >
                        {item.product.shortName}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.lineKey)}
                        aria-label="Удалить позицию"
                        className="text-ink/40 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-0.5 text-[10.5px] font-mono text-ink/45">
                      {item.product.sku}
                    </div>
                    {item.optionsNote && (
                      <div className="mt-1 text-[11px] font-medium text-ink/70 leading-snug">
                        {item.optionsNote}
                      </div>
                    )}
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-full bg-white ring-1 ring-ink/10">
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(
                              item.lineKey,
                              Math.max(1, item.qty - item.product.stepQty)
                            )
                          }
                          className="px-2.5 py-1 text-ink/70 hover:text-ink"
                          aria-label="Уменьшить количество"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-1.5 text-xs font-bold text-ink tabular-nums">
                          {item.qty} {item.product.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(
                              item.lineKey,
                              item.qty + item.product.stepQty
                            )
                          }
                          className="px-2.5 py-1 text-ink/70 hover:text-ink"
                          aria-label="Увеличить количество"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-xs font-extrabold text-ink tabular-nums">
                        {hasPrice(item.lineTotal)
                          ? formatPrice(item.lineTotal)
                          : "По запросу"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
            }}
            className="border-t border-ink/[0.08] bg-white px-5 pt-4 space-y-3"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-ink/60">Итого:</span>
              <span className="text-base font-extrabold text-ink tabular-nums">
                {hasPrice(grandTotal) ? formatPrice(grandTotal) : "По запросу"}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-track text-xs font-extrabold text-white hover:bg-[#e54d2b] transition-colors"
            >
              Оформить запрос КП
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="w-full py-1 text-[11px] font-medium text-ink/45 hover:text-ink"
            >
              Очистить список
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
