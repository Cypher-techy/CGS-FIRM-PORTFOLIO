/** Source and provenance for these local landing pages: public/portfolio/CREDITS.md. */
const captures = new Set([
  "cypher-terra",
  "edvora-lms",
  "cypher-fx",
  "chalar-farm-inventory",
  "kingangi-hotel-system",
  "sensei-brand-portfolio",
  "frontpage-supermarket",
  "view-point-inn",
  "summertime-grooming-beauty-hub",
]);
export function previewImages(slug: string, images: string[] = []) {
  const approved = images.filter((s) => /^https:\/\//i.test(s));
  return approved.length
    ? approved
    : captures.has(slug)
      ? [`/portfolio/${slug}.webp`]
      : [];
}
export function previewSrcSet(slug: string, src: string) {
  return captures.has(slug) && src === `/portfolio/${slug}.webp`
    ? `/portfolio/${slug}-480.webp 480w, ${src} 960w`
    : undefined;
}
