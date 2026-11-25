"use client";
import { useRef, useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
export default function FeatureRail({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null),
    [bounds, set] = useState([true, true]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () =>
      set([
        el.scrollLeft < 2,
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      ]);
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    el.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", sync);
    };
  }, [children]);
  function step(n: number) {
    const el = ref.current;
    if (el)
      el.scrollBy({
        left: n * ((el.firstElementChild?.clientWidth || el.clientWidth) + 16),
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  return (
    <div className="mt-8">
      <div
        className={
          "feature-rail" +
          (label === "featured projects" ? " project-rail" : "")
        }
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
      {!bounds.every(Boolean) && (
        <div className="rail-controls">
          <button
            aria-label={"Previous " + label}
            disabled={bounds[0]}
            onClick={() => step(-1)}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            aria-label={"Next " + label}
            disabled={bounds[1]}
            onClick={() => step(1)}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
