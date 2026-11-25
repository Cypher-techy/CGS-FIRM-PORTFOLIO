import Link from "next/link";
import { previewImages } from "@/lib/portfolio-images";
export default function PortfolioImage({
  slug,
  name,
  images,
  section,
}: {
  slug: string;
  name: string;
  images?: string[];
  section: "projects" | "products";
}) {
  const src = previewImages(slug, images)[0];
  return src ? (
    <Link
      href={`/${section}/${slug}`}
      className="portfolio-image"
      aria-label={`Explore ${name}`}
    >
      <img
        src={src}
        alt={`${name} interface preview`}
        width="1056"
        height="624"
        loading="lazy"
        decoding="async"
      />
    </Link>
  ) : null;
}
