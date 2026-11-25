import { copyFor } from "@/lib/content";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  FlaskConical,
  Leaf,
  Globe,
  CloudSun,
  Cpu,
  BookOpen,
  Users,
} from "lucide-react";
import { PageHero, Reveal, SectionHeading } from "@/components/ui";
import { collection } from "@/lib/content";

const AREAS = [
  {
    icon: Leaf,
    title: "Environmental Technology",
    desc: "Practical technologies for monitoring, management and sustainability outcomes.",
  },
  {
    icon: Globe,
    title: "Geospatial Research",
    desc: "Remote sensing, spatial analysis and land-change science applied to real decisions.",
  },
  {
    icon: CloudSun,
    title: "Climate Innovation",
    desc: "Carbon project intelligence, MRV methods and ecosystem monitoring research.",
  },
  {
    icon: Cpu,
    title: "Digital Product Experimentation",
    desc: "Prototypes and experiments that mature into CGS platforms and client solutions.",
  },
  {
    icon: BookOpen,
    title: "Technical Publications",
    desc: "Research reports, technical articles and downloadable publications.",
  },
  {
    icon: Users,
    title: "Collaborative Research",
    desc: "Joint programmes with universities, NGOs and development partners.",
  },
];

export default async function ResearchPage() {
  const content = await copyFor("research");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [PUBLICATIONS] = await Promise.all([collection("PUBLICATIONS")]);
  const researchPubs = PUBLICATIONS.filter(
    (p) => p.type === "Research Report" || p.type === "Insight",
  );

  return (
    <>
      <PageHero
        eyebrow={c("research_innovation")}
        title={c("research_that_becomes_real_solutions")}
        description={c("cgs_invests_in_applied_research_across_environmental")}
      />
      <section className="container-x py-20">
        <SectionHeading
          eyebrow={c("research_areas")}
          title={c("what_we_investigate")}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a, i) => (
            <Reveal key={c(a.title, a.title)} delay={i * 0.05}>
              <div className="card h-full p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-900 text-emerald2-light">
                  <a.icon className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-forest-950">
                  {c(a.title, a.title)}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate2">
                  {c(a.desc, a.desc)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={c("publications")}
              title={c("research_outputs_insights")}
              description={c(
                "selected_research_and_insight_publications_from_the",
              )}
            />
            <Reveal delay={0.1}>
              <Link href="/insights" className="btn-ghost">
                {c("all_insights")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {researchPubs.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <Link
                  href={`/insights/${p.slug}`}
                  className="card group flex h-full flex-col p-7 transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                    <span className="rounded-full bg-forest-900 px-3 py-1 text-emerald2-light">
                      {p.type}
                    </span>
                    <span className="text-slate2">{p.category}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold leading-snug text-forest-950">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate2">
                    {p.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-forest-800">
                    {c("read_publication")} <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16">
          <div className="topo-bg rounded-xl2 bg-forest-950 p-10 text-center text-white sm:p-14">
            <FlaskConical className="mx-auto h-10 w-10 text-emerald2-light" />
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-extrabold">
              {c("research_with_us")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              {c("universities_ngos_and_development_partners_propose_a")}{" "}
            </p>
            <Link href="/partnerships" className="btn-emerald mt-7">
              {c("propose_a_collaboration")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export const metadata = { title: "Research" };
