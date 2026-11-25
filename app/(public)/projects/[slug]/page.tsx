import { copyFor } from "@/lib/content";
import { caseNotes } from "@/lib/content";
import PlatformPreview from "@/components/PlatformPreview";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Target,
  ListChecks,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { PageHero, Reveal, SectionHeading } from "@/components/ui";
import { collection } from "@/lib/content";

export default async function ProjectDetailPage({
  params: pending,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = await pending;
  const content = await copyFor("projects.detail");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [PROJECTS] = await Promise.all([collection("PROJECTS")]);
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) notFound();
  const notes = await caseNotes(project.slug);

  return (
    <>
      <PageHero
        eyebrow={`${project.category} · ${project.ownership}`}
        title={project.name}
        description={project.description}
      />
      <section className="container-x py-20">
        <PlatformPreview
          name={project.name}
          url={project.url}
          screenshots={project.screenshots}
        />
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-10">
            <Reveal>
              <div className="card p-7">
                <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-forest-950">
                  <AlertTriangle className="h-5 w-5 text-emerald2" />{" "}
                  {c("problem_objectives")}{" "}
                </h2>
                <p className="mt-3 leading-relaxed text-slate-700">
                  {project.problem}
                </p>
                <ul className="mt-4 space-y-2">
                  {project.objectives.map((o) => (
                    <li key={o} className="flex gap-2.5 text-sm text-slate-700">
                      <Target className="mt-0.5 h-4 w-4 shrink-0 text-emerald2" />{" "}
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div className="card p-7">
                <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-forest-950">
                  <ListChecks className="h-5 w-5 text-emerald2" />{" "}
                  {c("scope_of_cgs_involvement")}{" "}
                </h2>
                <ul className="mt-3 space-y-2">
                  {project.scope.map((s) => (
                    <li key={s} className="flex gap-2.5 text-sm text-slate-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald2" />{" "}
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div className="card p-7">
                <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-forest-950">
                  <Wrench className="h-5 w-5 text-emerald2" />{" "}
                  {c("implemented_solution")}{" "}
                </h2>
                <p className="mt-3 leading-relaxed text-slate-700">
                  {project.solution}
                </p>
                <h3 className="mt-5 font-display text-sm font-bold uppercase tracking-wider text-forest-950">
                  {c("key_features")}
                </h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald2" />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                <h3 className="mt-5 font-display text-sm font-bold uppercase tracking-wider text-forest-950">
                  {c("technologies_used")}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-forest-900 px-3 py-1.5 text-xs font-semibold text-emerald2-light"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="card sticky top-28 overflow-hidden">
              <div className="bg-gradient-to-br from-forest-800 to-forest-950 p-7 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald2-light">
                  {c("case_study")}
                </p>
                <h2 className="mt-2 font-display text-2xl font-extrabold">
                  {project.name}
                </h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/60">{c("client")}</dt>
                    <dd className="font-semibold">{project.client}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/60">{c("category")}</dt>
                    <dd className="font-semibold text-right">
                      {project.category}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/60">{c("ownership")}</dt>
                    <dd className="font-semibold">{project.ownership}</dd>
                  </div>
                </dl>
              </div>
              <div className="space-y-3 p-7">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full"
                >
                  {c("visit_live_deployment")}{" "}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link href="/contact" className="btn-ghost w-full">
                  {c("start_a_similar_project")}{" "}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/projects" className="btn-ghost w-full">
                  {c("back_to_portfolio")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
        {notes.map((n) => (
          <article key={n.id} className="card mt-5 p-6">
            <h2 className="text-2xl font-bold">{n.title}</h2>
            <p className="mt-2 whitespace-pre-line">{n.body}</p>
            <ul>
              {n.results.map((r: string) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </article>
        ))}
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
  const item = (await collection("PROJECTS")).find((r) => r.slug === slug);
  return { title: item?.name ?? "Page not found" };
}
