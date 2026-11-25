import { EmptyState } from "@/components/ui";
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

export default async function DivisionsPage() {
  const content = await copyFor("divisions");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [DIVISIONS] = await Promise.all([collection("DIVISIONS")]);
  return (
    <>
      <PageHero
        eyebrow={c("business_divisions")}
        title={c("six_divisions_one_integrated_firm")}
        description={c("cgs_is_structured_into_six_specialised_divisions")}
      />
      <section className="container-x py-20">
        {DIVISIONS.length === 0 && (
          <EmptyState
            title="No entries published"
            message="Please check back for updates."
          />
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {DIVISIONS.map((d, i) => {
            const Icon = ICONS[d.icon] || Leaf;
            return (
              <Reveal key={d.slug} delay={i * 0.05}>
                <Link
                  href={`/divisions/${d.slug}`}
                  className="card group flex h-full flex-col p-8 transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest-900 text-emerald2-light transition group-hover:bg-sage group-hover:text-forest-950">
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="font-display text-4xl font-extrabold text-forest-900/10">
                      0{i + 1}
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-extrabold text-action">
                    {d.name}
                  </h2>
                  <p className="mt-2 flex-1 leading-relaxed text-slate2">
                    {d.short}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {d.capabilities.slice(0, 4).map((c) => (
                      <li
                        key={c}
                        className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-action"
                      >
                        {c}
                      </li>
                    ))}
                    {d.capabilities.length > 4 && (
                      <li className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-action">
                        +{d.capabilities.length - 4} {c("more")}
                      </li>
                    )}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-bold text-action">
                    {c("explore_division")}{" "}
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-14 text-center">
          <p className="text-slate2">{c("not_sure_which_division_you_need")}</p>
          <Link href="/contact" className="btn-primary mt-4">
            {c("ask_our_team")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}

export const metadata = { title: "Divisions" };
