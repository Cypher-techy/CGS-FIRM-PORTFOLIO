import { copyFor } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  Globe,
  Code2,
  BarChart3,
  CloudSun,
  FlaskConical,
} from "lucide-react";
import { PageHero, Reveal, SectionHeading } from "@/components/ui";
import { collection } from "@/lib/content";

const ICONS: Record<string, typeof Leaf> = {
  Leaf,
  Globe,
  Code2,
  BarChart3,
  CloudSun,
  FlaskConical,
};

export default async function DivisionDetailPage({
  params: pending,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = await pending;
  const content = await copyFor("divisions.detail");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [DIVISIONS, SERVICES] = await Promise.all([
    collection("DIVISIONS"),
    collection("SERVICES"),
  ]);
  const division = DIVISIONS.find((d) => d.slug === params.slug);
  if (!division) notFound();
  const Icon = ICONS[division.icon] || Leaf;
  const related = SERVICES.filter((s) => s.division === division.name);

  return (
    <>
      <PageHero
        eyebrow={c("business_division")}
        title={division.name}
        description={division.short}
      />
      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionHeading
              eyebrow={c("about_this_division")}
              title={c("what_we_do")}
            />
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg leading-relaxed text-slate-700">
                {division.description}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="mt-10 font-display text-xl font-bold text-forest-950">
                {c("capabilities")}
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {division.capabilities.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2.5 text-sm text-slate-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald2" />{" "}
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="card sticky top-28 p-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest-900 text-emerald2-light">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-forest-950">
                {c("engage_this_division")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate2">
                {c("tell_us_about_your_challenge_and_we")}{" "}
              </p>
              <Link
                href={`/contact?division=${encodeURIComponent(division.name)}`}
                className="btn-primary mt-6 w-full"
              >
                {c("start_an_enquiry")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services" className="btn-ghost mt-3 w-full">
                {c("browse_all_services")}
              </Link>
            </div>
          </Reveal>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <SectionHeading
              eyebrow={c("services")}
              title={`Services from ${division.name}`}
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s, i) => (
                <Reveal key={s.slug} delay={i * 0.05}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-lift"
                  >
                    <h3 className="font-display text-lg font-bold text-forest-950">
                      {s.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate2">
                      {s.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-forest-800">
                      {c("view_service")} <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
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
  const item = (await collection("DIVISIONS")).find((r) => r.slug === slug);
  return { title: item?.name ?? "Page not found" };
}
