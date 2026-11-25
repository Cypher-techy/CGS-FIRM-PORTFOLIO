"use client";
import { useEffect, useRef, useState } from "react";
import { Orbit, MoveHorizontal } from "lucide-react";
// Orthographic projection of the Blue Marble surface; redraw only on interaction.
export default function Globe() {
  const ref = useRef<HTMLCanvasElement>(null),
    texture = useRef<ImageData>(),
    start = useRef<number | null>(null);
  const [angle, set] = useState(0);
  useEffect(() => {
    const im = new Image();
    im.onload = () => {
      const c = document.createElement("canvas");
      c.width = im.width;
      c.height = im.height;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.drawImage(im, 0, 0);
        texture.current = ctx.getImageData(0, 0, c.width, c.height);
      }
    };
    im.src = "/atlas/surface.webp";
  }, []);
  useEffect(() => {
    if (!angle) return;
    const tex = texture.current,
      ctx = ref.current?.getContext("2d");
    if (!tex || !ctx) return;
    const n = 440,
      out = ctx.createImageData(n, n),
      tilt = 0.28;
    for (let j = 0; j < n; j++)
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5 - n / 2) / (n / 2),
          y = (n / 2 - j - 0.5) / (n / 2),
          zz = 1 - x * x - y * y;
        if (zz < 0) continue;
        const z = Math.sqrt(zz),
          lat = Math.asin(y * Math.cos(tilt) + z * Math.sin(tilt)),
          lon =
            Math.atan2(x, z * Math.cos(tilt) - y * Math.sin(tilt)) +
            0.46 +
            angle;
        const u =
            ((Math.floor((lon / (2 * Math.PI) + 0.5) * tex.width) % tex.width) +
              tex.width) %
            tex.width,
          v = Math.min(
            tex.height - 1,
            Math.floor((0.5 - lat / Math.PI) * tex.height),
          );
        const h = 0.35 + 0.63 * Math.max(0, -0.46 * x + 0.46 * y + 0.73 * z),
          s = (v * tex.width + u) * 4,
          k = (j * n + i) * 4;
        for (let b = 0; b < 3; b++)
          out.data[k + b] =
            tex.data[s + b] * h + [26, 108, 92][b] * Math.pow(1 - z, 5);
        out.data[k + 3] = 255;
      }
    ctx.putImageData(out, 0, 0);
  }, [angle]);
  return (
    <div className="atlas">
      <div className="atlas-label">
        <span />
        GEOSPATIAL INTELLIGENCE
      </div>
      <div
        className="orb"
        aria-label="Earth centered on Africa. Drag or use arrow keys to rotate"
        role="slider"
        aria-valuenow={Math.round((angle * 180) / Math.PI) % 360}
        aria-valuemin={-360}
        aria-valuemax={360}
        tabIndex={0}
        onKeyDown={(e) => {
          if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
            set(
              (a) => (a + (e.key === "ArrowLeft" ? -0.1 : 0.1)) % (Math.PI * 2),
            );
          }
        }}
        onPointerDown={(e) => {
          start.current = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerUp={() => (start.current = null)}
        onPointerCancel={() => (start.current = null)}
        onPointerMove={(e) => {
          if (start.current !== null) {
            const d = start.current - e.clientX;
            start.current = e.clientX;
            set((a) => (a + d * 0.008) % (Math.PI * 2));
          }
        }}
      >
        <canvas
          ref={ref}
          width={440}
          height={440}
          style={{ opacity: angle ? 1 : 0 }}
        />
        {!angle && (
          <svg className="routes" viewBox="0 0 400 400" aria-hidden="true">
            <g fill="none" stroke="#a9f7c5" strokeWidth="1" opacity=".9">
              <path d="M235 259Q270 109 163 79M235 259Q282 140 345 160M235 259Q181 170 119 201M235 259Q184 295 187 347M235 259Q356 199 355 102" />
            </g>
            {[
              [235, 259],
              [163, 79],
              [345, 160],
              [119, 201],
              [187, 347],
              [355, 102],
            ].map(([x, y]) => (
              <g key={x}>
                <circle cx={x} cy={y} r="8" fill="#acffc7" opacity=".18" />
                <circle cx={x} cy={y} r="3" fill="#d6ffd6" />
              </g>
            ))}
          </svg>
        )}
      </div>
      <svg className="orbits" viewBox="0 0 520 470" aria-hidden="true">
        <g transform="rotate(-26 260 233)" fill="none" stroke="#7ec4a2">
          <ellipse cx="260" cy="233" rx="257" ry="125" strokeOpacity=".48" />
          <ellipse
            cx="260"
            cy="233"
            rx="269"
            ry="135"
            strokeOpacity=".21"
            strokeDasharray="3 7"
          />
          <circle cx="517" cy="233" r="3" fill="#83ecb3" />
        </g>
      </svg>
      <div className="atlas-plate">
        <Orbit size={16} /> EARTH OBSERVATION <span>/ 01</span>
      </div>
      <div className="drag">
        <MoveHorizontal size={13} /> Drag to rotate
      </div>
    </div>
  );
}
