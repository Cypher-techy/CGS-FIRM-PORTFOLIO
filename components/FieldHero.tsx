"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ScanLine,
  Compass,
} from "lucide-react";
const Globe = dynamic(() => import("./Globe"), {
  loading: () => (
    <div className="atlas">
      <div className="orb" />
    </div>
  ),
});
export default function FieldHero({ children }: { children: ReactNode }) {
  const [plate, setPlate] = useState(0),
    ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = matchMedia(
      "(min-width:900px) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
    );
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData: boolean };
    };
    let frame = 0;
    function draw() {
      frame = 0;
      if (!el) return;
      el.style.setProperty(
        "--shift",
        mq.matches &&
          !nav.connection?.saveData &&
          (nav.deviceMemory ?? 8) >= 4 &&
          (nav.hardwareConcurrency || 8) >= 4
          ? `${Math.min(22, window.scrollY * 0.08)}px`
          : "0px",
      );
    }
    function scroll() {
      if (!frame && window.scrollY < 850) frame = requestAnimationFrame(draw);
    }
    window.addEventListener("scroll", scroll, { passive: true });
    mq.addEventListener("change", draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      mq.removeEventListener("change", draw);
    };
  }, []);
  return (
    <section className={"field-hero " + (plate ? "view-globe" : "")} ref={ref}>
      <picture>
        <source
          type="image/avif"
          sizes="100vw"
          srcSet="/field/river-720.avif 720w, /field/river-1568.avif 1568w"
        />
        <img
          className="field-image"
          src="/field/river-1568.webp"
          srcSet="/field/river-720.webp 720w, /field/river-1568.webp 1568w"
          sizes="100vw"
          fetchPriority="high"
          alt="A river winding through dense forest, seen from above"
          width="1568"
          height="882"
        />
      </picture>
      <div className="field-shade" />
      <div className="container-x field-content">
        <div className="mission-copy">{children}</div>
        {plate === 1 && (
          <div className="field-subject">
            <Globe />
          </div>
        )}
      </div>
      <div className="container-x hero-foot">
        <a href="#divisions" className="scroll-link">
          <ArrowDown size={14} /> Scroll to explore
        </a>
        <div className="plate-picker">
          <span className="plate-index">0{plate + 1} / 02</span>
          <span className="plate-title" aria-live="polite">
            {plate ? <Compass size={14} /> : <ScanLine size={14} />}{" "}
            {plate ? "Geospatial globe" : "Landscape observation"}
          </span>
          <button
            aria-label="Previous field plate"
            onClick={() => setPlate(1 - plate)}
          >
            <ChevronLeft size={17} />
          </button>
          <button
            aria-label="Next field plate"
            onClick={() => setPlate(1 - plate)}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
