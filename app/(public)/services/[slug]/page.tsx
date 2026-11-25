import { copyFor } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  AlertTriangle,
  ListChecks,
  PackageCheck,
  Building2,
  Cpu,
  MessageSquare,
} from "lucide-react";
import { PageHero, Reveal, SectionHeading } from "@/components/ui";
import { collection } from "@/lib/content";

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof AlertTriangle;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="card p-7">
        <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-action">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-900 text-emerald2-light">
            <Icon className="h-5 w-5" />
          </span>
          {title}
        </h3>
        <div className="mt-4">{children}</div>
      </div>
    </Reveal>
  );
}

export default async function ServiceDetailPage({
  params: pending,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = await pending;
  const content = await copyFor("services.detail");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [SERVICES] = await Promise.all([collection("SERVICES")]);
  const service = SERVICES.find((s) => s.slug === params.slug);
  if (!service) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.summary,
            provider: { "@type": "Organization", name: "Cypher Green Systems" },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero
        eyebrow={service.division}
        title={service.title}
        description={service.summary}
      />
      <section className="container-x py-20">
        <p className="mb-6 border-l-2 border-emerald2 pl-4 text-sm">
          {c("engagements_are_subject_to_scoping_and_availability")}
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <Block icon={AlertTriangle} title={c("problem_addressed")}>
            <p className="leading-relaxed text-slate2">{service.problem}</p>
          </Block>
          <Block icon={ListChecks} title={c("scope_of_work")}>
            <ul className="space-y-2.5">
              {service.scope.map((s) => (
                <li
                  key={s}
                  className="flex gap-2.5 text-sm leading-relaxed text-slate2"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald2" />{" "}
                  {s}
                </li>
              ))}
            </ul>
          </Block>
          <Block icon={PackageCheck} title={c("deliverables")}>
            <ul className="space-y-2.5">
              {service.deliverables.map((d) => (
                <li
                  key={d}
                  className="flex gap-2.5 text-sm leading-relaxed text-slate2"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald2" />{" "}
                  {d}
                </li>
              ))}
            </ul>
          </Block>
          <Block icon={Building2} title={c("relevant_industries")}>
            <div className="flex flex-wrap gap-2">
              {service.industries.map((i) => (
                <span
                  key={i}
                  className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-action"
                >
                  {i}
                </span>
              ))}
            </div>
            <h4 className="mt-6 flex items-center gap-2 font-display text-sm font-bold text-action">
              <Cpu className="h-4 w-4 text-emerald2" />{" "}
              {c("technologies_methodologies")}{" "}
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {service.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-forest-900 px-3 py-1.5 text-xs font-semibold text-emerald2-light"
                >
                  {t}
                </span>
              ))}
            </div>
          </Block>
        </div>

        <Reveal className="mt-12">
          <div className="topo-bg flex flex-col items-center justify-between gap-6 rounded-xl2 bg-forest-950 p-10 text-white sm:flex-row sm:p-12">
            <div>
              <h2 className="font-display text-2xl font-extrabold">
                {c("interested_in_this_service")}
              </h2>
              <p className="mt-2 max-w-lg text-white/70">
                {c("send_an_enquiry_and_our_team_will")}
              </p>
            </div>
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="btn-emerald shrink-0"
            >
              <MessageSquare className="h-4 w-4" /> {c("enquire_now")}{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
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
  const item = (await collection("SERVICES")).find((r) => r.slug === slug);
  return { title: item?.title ?? "Page not found" };
}
