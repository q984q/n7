"use client";

import React, { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** IntersectionObserver-based reveal with no animation-library runtime cost. */
export function Reveal({ children, className = "", delay = 0, y = 16 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    element.style.setProperty("--n7-reveal-y", `${y}px`);
    element.style.setProperty("--n7-reveal-delay", `${delay}s`);
    element.classList.add("n7-reveal-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        element.classList.add("n7-reveal-visible");
        observer.unobserve(element);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, y]);

  return <div ref={ref} className={className}>{children}</div>;
}
