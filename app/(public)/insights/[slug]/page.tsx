import { copyFor } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Tag } from "lucide-react";
import { Reveal } from "@/components/ui";
import DownloadButton from "@/components/DownloadButton";
import { collection } from "@/lib/content";

export default async function InsightDetailPage({
  params: pending,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = await pending;
  const content = await copyFor("insights.detail");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  const [PUBLICATIONS] = await Promise.all([collection("PUBLICATIONS")]);
  const pub = PUBLICATIONS.find((p) => p.slug === params.slug);
  if (!pub) notFound();
  const related = PUBLICATIONS.filter(
    (p) => p.slug !== pub.slug && p.category === pub.category,
  ).slice(0, 2);

  return (
    <article className="pt-32 sm:pt-40">
      <div className="container-x max-w-4xl">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-sm font-bold text-forest-800 hover:text-emerald2"
        >
          <ArrowLeft className="h-4 w-4" /> {c("all_insights")}{" "}
        </Link>
        <Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
            <span className="rounded-full bg-forest-900 px-3 py-1 text-emerald2-light">
              {pub.type}
            </span>
            <span className="text-slate2">{pub.category}</span>
            <span className="flex items-center gap-1.5 text-slate2">
              <CalendarDays className="h-4 w-4" />
              {new Date(pub.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight text-forest-950 sm:text-5xl">
            {pub.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate2">
            {pub.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-slate2" />
            {pub.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-forest-900"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="prose-cgs mt-10 border-t border-forest-900/10 pt-10">
            {pub.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Reveal>

        {pub.downloadable && (
          <Reveal>
            <div className="card mt-10 flex flex-col items-center justify-between gap-4 p-7 sm:flex-row">
              <div>
                <h2 className="font-display text-lg font-bold text-forest-950">
                  {c("download_this_publication")}
                </h2>
                <p className="text-sm text-slate2">
                  {c("save_a_copy_for_reference_or_share")}
                </p>
              </div>
              {pub.document_url?.startsWith("https://") ? (
                <a
                  className="btn-primary"
                  href={pub.document_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {c("open_document")}
                </a>
              ) : (
                <DownloadButton
                  title={pub.title}
                  body={pub.body}
                  slug={pub.slug}
                />
              )}
            </div>
          </Reveal>
        )}

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-extrabold text-forest-950">
              {c("related_reading")}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/insights/${r.slug}`}
                  className="card group p-6 transition hover:shadow-lift"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald2">
                    {r.type} · {r.category}
                  </p>
                  <h3 className="mt-2 font-display font-bold text-forest-950">
                    {r.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-forest-800">
                    {c("read")} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = (await collection("PUBLICATIONS")).find((r) => r.slug === slug);
  return { title: item?.title ?? "Page not found" };
}
