import { EmptyState } from "@/components/ui";
import { copyFor } from "@/lib/content";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { PageHero, Reveal, SectionHeading } from "@/components/ui";
import { collection } from "@/lib/content";

export default async function IndustriesPage() {
  const content = await copyFor("industries");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [INDUSTRIES] = await Promise.all([collection("INDUSTRIES")]);
  return (
    <>
      <PageHero
        eyebrow={c("industries_served")}
        title={c("where_cgs_creates_value")}
        description={c(
          "from_conservation_organisations_to_financial_technology_we",
        )}
      />
      <section className="container-x py-20">
        {INDUSTRIES.length === 0 && (
          <EmptyState
            title="No entries published"
            message="Please check back for updates."
          />
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.slug} delay={i * 0.04}>
              <article className="card flex h-full flex-col p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-900 text-emerald2-light">
                  <Building2 className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-action">
                  {ind.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate2">
                  {ind.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {ind.offerings.map((o) => (
                    <li key={o} className="flex gap-2 text-sm text-slate2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald2" />{" "}
                      {o}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 text-center">
          <SectionHeading
            align="center"
            eyebrow={c("your_sector")}
            title={c("don_t_see_your_industry")}
            description={c("many_engagements_cross_sector_boundaries_tell_us")}
          />
          <Link href="/contact" className="btn-primary mt-8">
            {c("contact_cgs")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}

export const metadata = { title: "Industries" };
