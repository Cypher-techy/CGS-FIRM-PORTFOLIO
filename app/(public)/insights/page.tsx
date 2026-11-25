import { copyFor } from "@/lib/content";
import Link from "next/link";
import { ArrowUpRight, Download, Search } from "lucide-react";
import { PageHero, Reveal, EmptyState } from "@/components/ui";
import { collection } from "@/lib/content";

const TYPES = ["All", "News", "Article", "Research Report", "Insight"] as const;

export default async function InsightsPage({
  searchParams: pending,
}: {
  searchParams: Promise<{ type?: string; q?: string }>;
}) {
  const searchParams = await pending;
  const content = await copyFor("insights");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [PUBLICATIONS] = await Promise.all([collection("PUBLICATIONS")]);
  const type = searchParams.type || "All";
  const q = (searchParams.q || "").toLowerCase();

  const list = PUBLICATIONS.filter((p) => {
    const typeOk = type === "All" || p.type === type;
    const qOk =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    return typeOk && qOk;
  });

  return (
    <>
      <PageHero
        eyebrow={c("insights_publications")}
        title={c("news_articles_and_research")}
        description={c(
          "company_news_technical_articles_environmental_publications_and",
        )}
      />
      <section className="container-x py-20">
        <form
          method="get"
          className="flex flex-col gap-4 sm:flex-row"
          role="search"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate2" />
            <input
              name="q"
              defaultValue={searchParams.q || ""}
              placeholder={c("search_articles_topics_tags")}
              className="input !pl-12"
              aria-label="Search publications"
            />
          </div>
          <input type="hidden" name="type" value={type} />
          <button type="submit" className="btn-primary">
            {c("search")}
          </button>
        </form>

        <div
          className="mt-5 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by type"
        >
          {TYPES.map((t) => (
            <Link
              key={t}
              href={`/insights?type=${t}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${type === t ? "bg-forest-900 text-white" : "bg-white text-forest-900 hover:bg-mist"}`}
            >
              {t}
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title={c("no_publications_found")}
              message={c("try_a_different_search_term_or_category")}
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {list.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <article className="card group flex h-full flex-col p-7 transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
                    <span className="rounded-full bg-forest-900 px-3 py-1 text-emerald2-light">
                      {p.type}
                    </span>
                    <span className="text-slate2">{p.category}</span>
                    <span className="text-slate2">
                      {new Date(p.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <Link href={`/insights/${p.slug}`}>
                    <h2 className="mt-4 font-display text-xl font-bold leading-snug text-forest-950 group-hover:text-forest-700">
                      {p.title}
                    </h2>
                  </Link>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate2">
                    {p.excerpt}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-forest-900"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <Link
                      href={`/insights/${p.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-800"
                    >
                      {c("read")} <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    {p.downloadable && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald2">
                        <Download className="h-4 w-4" />{" "}
                        {c("downloadable")}{" "}
                      </span>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export const metadata = { title: "Insights" };
