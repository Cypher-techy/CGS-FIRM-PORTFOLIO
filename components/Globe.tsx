"use client";
import { useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
// Orthographic projection of the Blue Marble surface; redraw only on interaction.
export default function Globe() {
  const ref = useRef<HTMLCanvasElement>(null),
    texture = useRef<ImageData>(),
    start = useRef<number | null>(null);
  const [ready, onReady] = useState(false);
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
        onReady(true);
      }
    };
    im.src = "/atlas/surface.webp";
  }, []);
  useEffect(() => {
    if (!angle || !ready) return;
    const tex = texture.current,
      ctx = ref.current?.getContext("2d");
    if (!tex || !ctx) return;
    const n = ref.current!.width,
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
  }, [angle, ready]);
  return (
    <div className="atlas">
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
          width={300}
          height={300}
          style={{ opacity: angle && ready ? 1 : 0 }}
        />
      </div>
      <div className="drag">
        <MoveHorizontal size={13} /> Drag to rotate
      </div>
    </div>
  );
}
