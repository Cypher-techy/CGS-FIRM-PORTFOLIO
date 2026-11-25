import { EmptyState } from "@/components/ui";
import ProductTile from "@/components/ProductTile";
import { copyFor } from "@/lib/content";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { PageHero, Reveal } from "@/components/ui";
import { collection } from "@/lib/content";

export default async function ProductsPage() {
  const content = await copyFor("products");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [PRODUCTS] = await Promise.all([collection("PRODUCTS")]);
  return (
    <>
      <PageHero
        eyebrow={c("products_digital_platforms")}
        title={c("proprietary_platforms_built_by_cgs")}
        description={c(
          "cgs_owned_digital_products_spanning_environmental_technology",
        )}
      />
      <section className="container-x py-20">
        {PRODUCTS.length === 0 && (
          <EmptyState
            title="No entries published"
            message="Please check back for updates."
          />
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
                <div className={`bg-gradient-to-br ${p.accent} p-8 text-white`}>
                  <div className="flex items-start justify-between">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 font-display text-2xl font-extrabold backdrop-blur">
                      <ProductTile
                        slug={p.slug}
                        name={p.name}
                        logo={p.logo_url}
                      />
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${p.status === "Live" ? "bg-white/25" : "bg-black/25"}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-wider text-white/80">
                    {p.classification}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold">
                    {p.name}
                  </h2>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="flex-1 text-sm leading-relaxed text-slate2">
                    {p.description}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-slate-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald2" />{" "}
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary !px-5 !py-2.5 !text-sm"
                    >
                      {c("visit_product")} <ExternalLink className="h-4 w-4" />
                    </a>
                    <Link
                      href={`/products/${p.slug}`}
                      className="btn-ghost !px-5 !py-2.5 !text-sm"
                    >
                      {c("details")} <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14 text-center">
          <p className="text-slate2">
            {c("interested_in_deploying_or_licensing_a_cgs")}
          </p>
          <Link href="/contact" className="btn-primary mt-4">
            {c("talk_to_our_team")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}

export const metadata = { title: "Products" };
