import PortfolioImage from "@/components/PortfolioImage";
import ServiceFinder from "@/components/ServiceFinder";
import { copyFor } from "@/lib/content";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Globe,
  Code2,
  BarChart3,
  CloudSun,
  FlaskConical,
  ExternalLink,
  Sparkles,
  Handshake,
  BookOpen,
  Building2,
  Cpu,
  LineChart,
} from "lucide-react";
import FieldHero from "@/components/FieldHero";
import FeatureRail from "@/components/FeatureRail";
import { Reveal, SectionHeading } from "@/components/ui";
import { collection } from "@/lib/content";

const plates: Record<string, [string, string]> = {
  Leaf: ["terrain", "ENV"],
  Globe: ["mapping", "GIS"],
  Code2: ["systems", "SYS"],
  BarChart3: ["data", "DAT"],
  CloudSun: ["climate", "CLM"],
  FlaskConical: ["research", "R&D"],
};
const ICONS: Record<string, typeof Leaf> = {
  Leaf,
  Globe,
  Code2,
  BarChart3,
  CloudSun,
  FlaskConical,
};

export default async function HomePage() {
  const content = await copyFor("home");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [DIVISIONS, SERVICES, PRODUCTS, PROJECTS, INDUSTRIES, PUBLICATIONS] =
    await Promise.all([
      collection("DIVISIONS"),
      collection("SERVICES"),
      collection("PRODUCTS"),
      collection("PROJECTS"),
      collection("INDUSTRIES"),
      collection("PUBLICATIONS"),
    ]);
  const featuredProjects = PROJECTS.filter((p) => p.featured);
  const featuredPubs = PUBLICATIONS.filter((p) => p.featured);

  return (
    <>
      <FieldHero>
        <div className="signal">
          <span /> {c("technology_environment_opportunity")}
        </div>
        <h1>
          {c("engineering_technology")}
          <br />
          <em>{c("advancing_sustainability")}</em>
          <br />
          {c("creating_opportunity")}
        </h1>
        <p>
          {c("cypher_green_systems_connects_environmental_science_geospatial")}
        </p>
        <div className="hero-actions">
          <Link className="primary-action" href="/services">
            {c("explore_our_services")} <ArrowRight size={16} />
          </Link>
          <Link className="secondary-action" href="/projects">
            {c("view_our_portfolio")} <ArrowUpRight size={16} />
          </Link>
          <Link className="partner-action" href="/partnerships">
            {c("partner_with_cgs")} <ArrowUpRight size={13} />
          </Link>
        </div>{" "}
      </FieldHero>
      {/* ── DIVISIONS ────────────────────────────────────────── */}
      <section id="divisions" className="division-band py-14 lg:py-16">
        <div className="division-chapter container-x">
          <div className="division-intro flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={c("01_our_capabilities")}
              title={c("our_business_divisions")}
              description={c(
                "each_division_brings_deep_specialisation_together_they",
              )}
            />
            <Reveal delay={0.1}>
              <Link href="/divisions" className="btn-ghost">
                {c("all_divisions")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <span className="chapter-progress" aria-hidden="true" />
          </div>
          <div className="division-grid mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DIVISIONS.map((d, i) => {
              const Icon = ICONS[d.icon] || Leaf;
              const [art, code] = plates[d.icon] ?? ["terrain", "DIV"];
              return (
                <Reveal key={d.slug} delay={i * 0.06}>
                  <Link
                    href={`/divisions/${d.slug}`}
                    className="division-card card group relative flex h-full flex-col overflow-hidden transition hover:-translate-y-1"
                  >
                    <div className="division-plate">
                      <img
                        loading="lazy"
                        decoding="async"
                        width="960"
                        height="420"
                        src={`/field/divisions/${art}-480.webp`}
                        srcSet={`/field/divisions/${art}-480.webp 480w, /field/divisions/${art}-960.webp 960w`}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        alt=""
                      />
                      <span>
                        <Icon size={16} /> {code} /{" "}
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-action">
                      {d.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate2">
                      {d.short}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-action">
                      {c("explore_division")}{" "}
                      <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INTRODUCTION ─────────────────────────────────────── */}
      <section className="container-x py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow={c("who_we_are")}
            title={c("a_firm_where_technology_and_the_environment")}
            description={c("cgs_operates_at_the_intersection_of_environmental")}
          />
          <Reveal delay={0.1}>
            <div className="space-y-4 text-base leading-relaxed text-slate2">
              <p>
                {c(
                  "our_work_spans_environmental_assessment_and_sustainability",
                )}{" "}
              </p>
              <p>
                {c(
                  "alongside_client_services_we_build_proprietary_platforms",
                )}{" "}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/about" className="btn-primary">
                  {c("about_cgs")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/divisions" className="btn-ghost">
                  {c("our_divisions")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURED SERVICES ────────────────────────────────── */}
      <section className="container-x py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={c("featured_services")}
            title={c("professional_services_delivered_with_rigour")}
            description={c(
              "from_environmental_assessment_to_enterprise_software_every",
            )}
          />
          <Reveal delay={0.1}>
            <Link href="/services" className="btn-ghost">
              {c("service_directory")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <ServiceFinder
          label={c("choose_a_division")}
          groups={Object.entries(
            SERVICES.reduce<
              Record<string, { slug: string; title: string; summary: string }[]>
            >((groups, s) => {
              (groups[s.division] ??= []).push({
                slug: s.slug,
                title: s.title,
                summary: s.summary,
              });
              return groups;
            }, {}),
          ).map(([name, services]) => ({
            name,
            services,
            art:
              plates[DIVISIONS.find((d) => d.name === name)?.icon ?? ""]?.[0] ??
              "terrain",
          }))}
        />
      </section>

      {/* ── PRODUCTS ─────────────────────────────────────────── */}
      <section className="bg-forest-950 py-20 text-white lg:py-28">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              dark
              eyebrow={c("proprietary_products")}
              title={c("digital_platforms_built_by_cgs")}
              description={c(
                "our_own_products_environmental_intelligence_education_technology",
              )}
            />
            <Reveal delay={0.1}>
              <Link href="/products" className="btn-ghost-dark">
                {c("all_products")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <FeatureRail label="featured products">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-xl2 border border-white/12 bg-white/5 p-6 transition hover:bg-white/10">
                  <PortfolioImage
                    slug={p.slug}
                    name={p.name}
                    url={p.url}
                    images={p.screenshots}
                  />
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald2-light">
                    {p.category}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold">
                    {p.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">
                    {p.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${p.status === "Live" ? "bg-emerald2/20 text-emerald2-light" : "bg-amber-400/20 text-amber-300"}`}
                    >
                      {p.status}
                    </span>
                    <Link
                      href={`/products/${p.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-emerald2-light hover:text-white"
                    >
                      {c("details")} <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </FeatureRail>
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────── */}
      <section className="container-x py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={c("client_portfolio")}
            title={c("selected_projects_and_case_studies")}
            description={c(
              "commissioned_business_solutions_delivered_for_hospitality_retail",
            )}
          />
          <Reveal delay={0.1}>
            <Link href="/projects" className="btn-ghost">
              {c("full_portfolio")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <FeatureRail label="featured projects">
          {featuredProjects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
                <PortfolioImage
                  url={p.url}
                  slug={p.slug}
                  name={p.name}
                  images={p.screenshots}
                />
                <div className="bg-forest-800 p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald2-light">
                    {p.category}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    {p.client} · {p.ownership}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex-1 text-sm leading-relaxed text-slate2">
                    {p.description}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
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
                      className="inline-flex items-center gap-1 text-sm font-bold text-action hover:text-emerald2"
                    >
                      {c("live_site")} <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </FeatureRail>
      </section>

      {/* ── RESEARCH ─────────────────────────────────────────── */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-xl2 bg-forest-950 p-8 text-white sm:p-12">
              <div
                className="grid-bg absolute inset-0 opacity-50"
                aria-hidden
              />
              <div className="relative">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sage text-forest-950">
                  <FlaskConical className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-extrabold sm:text-3xl">
                  {c("research_innovation")}
                </h3>
                <p className="mt-3 leading-relaxed text-white/70">
                  {c(
                    "applied_research_in_environmental_technology_geospatial_science",
                  )}{" "}
                </p>
                <ul className="mt-6 space-y-2.5 text-sm text-white/80">
                  {[
                    c("environmental_technology_research"),
                    c("geospatial_climate_innovation"),
                    c("technical_publications"),
                    c("collaborative_research_programmes"),
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald2-light" /> {t}
                    </li>
                  ))}
                </ul>
                <Link href="/research" className="btn-emerald mt-8">
                  {c("explore_research")} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow={c("innovation_highlights")}
              title={c("where_our_products_come_from")}
              description={c("every_cgs_platform_began_as_an_experiment")}
            />
            <div className="mt-8 space-y-4">
              {PRODUCTS.map((p) => (
                <Reveal key={p.slug}>
                  <div className="card flex items-center gap-4 p-4">
                    <PortfolioImage
                      compact
                      slug={p.slug}
                      name={p.name}
                      url={p.url}
                      images={p.screenshots}
                    />
                    <Link
                      href={`/products/${p.slug}`}
                      className="group flex flex-1 items-center gap-2"
                    >
                      <span className="flex-1">
                        <span className="block font-display font-bold text-action">
                          {p.name}
                        </span>
                        <span className="block text-sm text-slate2">
                          {p.classification}
                        </span>
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-action transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ───────────────────────────────────────── */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading
          align="center"
          eyebrow={c("industries_served")}
          title={c("trusted_across_sectors")}
          description={c("we_work_with_organisations_where_technology_and")}
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.slug} delay={i * 0.04}>
              <Link
                href="/industries"
                className="card group flex h-full flex-col p-5 text-center transition hover:-translate-y-1 hover:shadow-lift"
              >
                <Building2 className="mx-auto h-7 w-7 text-emerald2" />
                <h3 className="mt-3 font-display text-sm font-bold leading-snug text-action">
                  {ind.name}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PARTNERSHIP CTA ──────────────────────────────────── */}
      <section className="bg-forest-950 py-20 text-white lg:py-24">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow">{c("partnerships")}</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              {c("build_with_us_research_with_us_grow")}{" "}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
              {c(
                "we_partner_with_institutions_technology_providers_research",
              )}{" "}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/partnerships" className="btn-emerald justify-center">
              {c("partner_with_cgs")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-ghost-dark justify-center">
              {c("start_a_conversation")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── INSIGHTS ─────────────────────────────────────────── */}
      <section className="container-x py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={c("insights_publications")}
            title={c("latest_thinking_from_cgs")}
            description={c(
              "technical_articles_research_reports_and_company_news",
            )}
          />
          <Reveal delay={0.1}>
            <Link href="/insights" className="btn-ghost">
              <BookOpen className="h-4 w-4" /> {c("all_insights")}{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {featuredPubs.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link
                href={`/insights/${p.slug}`}
                className="division-card card group relative flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                  <span className="rounded-full bg-forest-900 px-3 py-1 text-emerald2-light">
                    {p.type}
                  </span>
                  <span className="text-slate2">
                    {new Date(p.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold leading-snug text-action">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate2">
                  {p.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-action">
                  {c("read_insight")} <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────────── */}
      <section className="container-x pb-24">
        <Reveal>
          <div className="topo-bg relative overflow-hidden rounded-xl2 bg-forest-900 p-10 text-center text-white sm:p-16">
            <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                {c("have_a_problem_worth_solving")}{" "}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/70">
                {c("tell_us_about_your_project_partnership_idea")}{" "}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="btn-emerald">
                  {c("contact_cgs")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/services" className="btn-ghost-dark">
                  {c("browse_services")}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
