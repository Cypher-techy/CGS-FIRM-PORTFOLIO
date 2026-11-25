import { ExternalLink } from "lucide-react";
import { previewImages, previewSrcSet } from "@/lib/portfolio-images";
export default function PortfolioImage({
  slug,
  name,
  images,
  url,
  compact = false,
}: {
  slug: string;
  name: string;
  images?: string[];
  url: string;
  compact?: boolean;
}) {
  const src = previewImages(slug, images)[0];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`portfolio-image ${compact ? "w-24 shrink-0 rounded" : ""}`}
      aria-label={`Visit ${name} website (opens in a new tab)`}
    >
      {src ? (
        <img
          src={src}
          srcSet={previewSrcSet(slug, src)}
          sizes={
            compact
              ? "96px"
              : "(max-width: 640px) 90vw, (max-width: 1024px) 48vw, 440px"
          }
          alt={`${name} website preview`}
          width="960"
          height="567"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="grid h-full place-content-center gap-1 text-center text-sm text-slate2">
          <ExternalLink className="mx-auto h-5 w-5" />
          Visit website<span className="text-xs">Preview unavailable</span>
        </span>
      )}
    </a>
  );
}
