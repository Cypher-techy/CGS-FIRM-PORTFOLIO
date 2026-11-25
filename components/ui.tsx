"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      !("IntersectionObserver" in window) ||
      matchMedia("(prefers-reduced-motion:reduce)").matches ||
      node.getBoundingClientRect().top < innerHeight
    )
      return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("revealed");
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px 20px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{ animationDelay: `${Math.min(delay, 0.09)}s` }}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <Reveal
      className={
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"
      }
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className={`section-title ${dark ? "text-white" : "text-action"}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`section-deck ${align === "center" ? "mx-auto" : ""} ${dark ? "text-white/70" : "text-slate2"}`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="topo-bg relative overflow-hidden bg-forest-950 pb-20 pt-36 text-white sm:pt-44">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative">
        <div className="page-arrive">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title">
            {title}
          </h1>
          {description && (
            <p className="section-deck text-white/75">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="card p-10 text-center">
      <p className="font-display text-xl font-bold text-action">{title}</p>
      <p className="mt-2 text-sm text-slate2">{message}</p>
    </div>
  );
}
