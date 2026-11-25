import { EmptyState } from "@/components/ui";
import { copyFor } from "@/lib/content";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import { PageHero, Reveal, SectionHeading } from "@/components/ui";
import { collection } from "@/lib/content";

export default async function ProjectsPage() {
  const content = await copyFor("projects");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [PROJECTS] = await Promise.all([collection("PROJECTS")]);
  return (
    <>
      <PageHero
        eyebrow={c("projects_client_portfolio")}
        title={c("business_solutions_and_commissioned_work")}
        description={c("a_separate_portfolio_of_client_projects_delivered")}
      />
      <section className="container-x py-20">
        {PROJECTS.length === 0 && (
          <EmptyState
            title="No entries published"
            message="Please check back for updates."
          />
        )}
        <Reveal>
          <div className="card flex items-start gap-4 p-6">
            <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald2" />
            <p className="text-sm leading-relaxed text-slate-700">
              <strong className="text-forest-950">
                {c("transparency_note")}
              </strong>{" "}
              {c("these_are_client_commissioned_projects_cgs_presents")}{" "}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
                <div className="bg-gradient-to-br from-forest-800 to-forest-950 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald2-light">
                      {p.category}
                    </p>
                    {p.featured && (
                      <span className="rounded-full bg-emerald2 px-2.5 py-0.5 text-[11px] font-bold text-forest-950">
                        {c("featured")}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-display text-xl font-bold">
                    {p.name}
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    {p.client} · {p.ownership}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex-1 text-sm leading-relaxed text-slate2">
                    {p.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.technologies.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-forest-900"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="btn-primary !px-5 !py-2.5 !text-xs"
                    >
                      {c("case_study")}
                    </Link>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-bold text-forest-800 hover:text-emerald2"
                    >
                      {c("live_site")} <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <div className="topo-bg rounded-xl2 bg-forest-950 p-10 text-center text-white">
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
              {c("your_project_could_be_next")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              {c("tell_us_what_you_need_to_build")}
            </p>
            <Link href="/contact" className="btn-emerald mt-7">
              {c("start_a_project")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export const metadata = { title: "Projects" };
