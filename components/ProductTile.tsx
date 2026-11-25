import {
  BookOpen,
  ChartCandlestick,
  Sprout,
  Globe2,
  Layers,
} from "lucide-react";
export default function ProductTile({
  slug,
  name,
  logo,
}: {
  slug: string;
  name: string;
  logo?: string;
}) {
  const icons = {
    "cypher-terra": Globe2,
    "edvora-lms": BookOpen,
    "cypher-fx": ChartCandlestick,
    "chalar-farm-inventory": Sprout,
  };
  const Icon = icons[slug as keyof typeof icons] || Layers;
  return logo?.startsWith("https://") ? (
    <img
      src={logo}
      alt={`${name} logo`}
      className="h-full w-full object-contain"
      loading="lazy"
    />
  ) : (
    <Icon
      size={30}
      strokeWidth={1.6}
      aria-label={`${name} category thumbnail`}
    />
  );
}
