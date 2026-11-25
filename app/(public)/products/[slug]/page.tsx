import ProductTile from "@/components/ProductTile";
import { copyFor } from "@/lib/content";
import PlatformPreview from "@/components/PlatformPreview";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Cpu,
  MessageSquare,
} from "lucide-react";
import { PageHero, Reveal, SectionHeading } from "@/components/ui";
import { collection } from "@/lib/content";

export default async function ProductDetailPage({
  params: pending,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = await pending;
  const content = await copyFor("products.detail");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [PRODUCTS] = await Promise.all([collection("PRODUCTS")]);
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  return (
    <>
      <PageHero
        eyebrow={product.classification}
        title={product.name}
        description={product.description}
      />
      <section className="container-x py-20">
        <PlatformPreview
          name={product.name}
          url={product.url}
          screenshots={product.screenshots}
        />
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionHeading
              eyebrow={c("key_features")}
              title={c("what_the_platform_does")}
            />
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.features.map((f) => (
                <li
                  key={f}
                  className="card flex items-start gap-3 p-5 text-sm font-medium text-slate-700"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald2" />{" "}
                  {f}
                </li>
              ))}
            </ul>

            <Reveal delay={0.1}>
              <div className="card mt-8 p-7">
                <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-forest-950">
                  <Cpu className="h-5 w-5 text-emerald2" />{" "}
                  {c("technology_stack")}{" "}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-forest-900 px-4 py-2 text-sm font-semibold text-emerald2-light"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate2">
                  {c("stack_shown_where_verified_contact_us_for")}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="card sticky top-28 overflow-hidden">
              <div
                className={`bg-gradient-to-br ${product.accent} p-8 text-white`}
              >
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 font-display text-2xl font-extrabold">
                  <ProductTile
                    slug={product.slug}
                    name={product.name}
                    logo={product.logo_url}
                  />
                </span>
                <h2 className="mt-4 font-display text-2xl font-extrabold">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm text-white/80">{product.category}</p>
                <span className="mt-3 inline-block rounded-full bg-white/25 px-3 py-1 text-xs font-bold">
                  {c("status")} {product.status}
                </span>
              </div>
              <div className="space-y-3 p-7">
                <a
                  href={product.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full"
                >
                  {c("visit_product")} <ExternalLink className="h-4 w-4" />
                </a>
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="btn-ghost w-full"
                >
                  <MessageSquare className="h-4 w-4" />{" "}
                  {c("enquire_about_deployment")}{" "}
                </Link>
                <Link href="/products" className="btn-ghost w-full">
                  {c("all_products")} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = (await collection("PRODUCTS")).find((r) => r.slug === slug);
  return { title: item?.name ?? "Page not found" };
}
