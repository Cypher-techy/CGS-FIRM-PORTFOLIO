import { copyFor } from "@/lib/content";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHero, Reveal, SectionHeading, EmptyState } from "@/components/ui";
import { collection } from "@/lib/content";

export default async function ServicesPage({
  searchParams: pending,
}: {
  searchParams: Promise<{ division?: string }>;
}) {
  const searchParams = await pending;
  const content = await copyFor("services");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [SERVICES, DIVISIONS] = await Promise.all([
    collection("SERVICES"),
    collection("DIVISIONS"),
  ]);
  const filter = searchParams.division;
  const list = SERVICES.filter(
    (s) => s.published && (!filter || s.division === filter),
  );

  return (
    <>
      <PageHero
        eyebrow={c("services")}
        title={c("professional_services_directory")}
        description={c(
          "explore_engagement_options_by_division_availability_scope",
        )}
      />
      <section className="container-x py-20">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by division"
        >
          <Link
            href="/services"
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${!filter ? "bg-forest-900 text-white" : "bg-surface text-action hover:bg-mist"}`}
          >
            {c("all_services")}{" "}
          </Link>
          {DIVISIONS.map((d) => (
            <Link
              key={d.slug}
              href={`/services?division=${encodeURIComponent(d.name)}`}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${filter === d.name ? "bg-forest-900 text-white" : "bg-surface text-action hover:bg-mist"}`}
            >
              {d.name}
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title={c("no_services_found")}
              message={c("no_published_services_match_this_filter_try")}
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.04}>
                <Link
                  href={`/services/${s.slug}`}
                  className="card group flex h-full flex-col p-7 transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald2">
                    {s.division}
                  </p>
                  <h2 className="mt-2 font-display text-lg font-bold text-action">
                    {s.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate2">
                    {s.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-action"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-action">
                    {c("view_enquire")} <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-16">
          <div className="topo-bg rounded-xl2 bg-forest-950 p-10 text-center text-white">
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
              {c("need_something_not_listed")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              {c("we_regularly_deliver_custom_engagements_describe_your")}
            </p>
            <Link href="/contact" className="btn-emerald mt-7">
              {c("request_a_quotation")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export const metadata = { title: "Services" };
