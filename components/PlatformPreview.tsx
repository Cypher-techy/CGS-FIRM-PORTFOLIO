"use client";
import { previewImages } from "@/lib/portfolio-images";
import { useState } from "react";
import { ExternalLink, Monitor } from "lucide-react";
export default function PlatformPreview({
  slug,
  name,
  url,
  screenshots = [],
}: {
  slug: string;
  name: string;
  url: string;
  screenshots?: string[];
}) {
  const [open, set] = useState(false);
  return (
    <section className="card my-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 p-4">
        <h2 className="flex items-center gap-2 font-bold">
          <Monitor size={18} /> Platform preview
        </h2>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm"
        >
          Open site <ExternalLink size={14} />
        </a>
      </div>
      {previewImages(slug, screenshots).map((s, i) => (
        <img
          key={s}
          src={s}
          loading="lazy"
          width="1056"
          height="624"
          decoding="async"
          className="h-auto w-full"
          alt={`${name} screenshot ${i + 1}`}
        />
      ))}
      {open ? (
        <>
          <iframe
            title={`${name} live preview`}
            className="h-[480px] w-full border-t"
            loading="lazy"
            src={url}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-forms"
          />
          <p className="p-3 text-xs">
            If this platform restricts embedding, use Open site.
          </p>
        </>
      ) : (
        <button
          onClick={() => set(true)}
          className="w-full bg-forest-900 py-5 font-semibold text-white"
        >
          Load live preview of {name}
        </button>
      )}
    </section>
  );
}
