/** Local captures from the public interfaces. CMS screenshots take precedence. */
const sourceCaptures: Record<string, string> = {
  "view-point-inn": "/portfolio/view-point-inn.webp",
  "cypher-fx": "/portfolio/cypher-fx.webp",
};
export function previewImages(slug: string, images: string[] = []) {
  const approved = images.filter((s) => /^https:\/\//i.test(s));
  return approved.length
    ? approved
    : sourceCaptures[slug]
      ? [sourceCaptures[slug]]
      : [];
}
