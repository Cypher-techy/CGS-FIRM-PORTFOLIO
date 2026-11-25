"use client";
import { useCopy } from "@/components/CopyContext";

import { useState } from "react";
import {
  Briefcase,
  MapPin,
  Loader2,
  CheckCircle2,
  Send,
  Clock,
} from "lucide-react";
import { PageHero, Reveal, SectionHeading, EmptyState } from "@/components/ui";
import type { Vacancy } from "@/lib/types";

export default function CareersPage({ VACANCIES }: { VACANCIES: Vacancy[] }) {
  const c = useCopy("careers");

  const [active, setActive] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function apply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("done");
      setMessage(
        "Application received. Our team reviews every application and responds to shortlisted candidates.",
      );
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  const published = VACANCIES.filter((v) => v.published);

  return (
    <>
      <PageHero
        eyebrow={c("careers_opportunities")}
        title={c("build_your_career_at_the_intersection_of")}
        description={c(
          "employment_internships_graduate_programmes_research_opportunities_technical",
        )}
      />
      <section className="container-x py-20">
        {published.length === 0 ? (
          <EmptyState
            title={c("no_open_roles_right_now")}
            message={c("check_back_soon_new_opportunities_are_posted")}
          />
        ) : (
          <div className="space-y-5">
            {published.map((v, i) => (
              <Reveal key={v.slug} delay={i * 0.05}>
                <article className="card overflow-hidden">
                  <button
                    className="flex w-full flex-col gap-3 p-7 text-left sm:flex-row sm:items-center sm:justify-between"
                    onClick={() => {
                      setStatus("idle");
                      setMessage("");
                      setActive(active === v.slug ? null : v.slug);
                    }}
                    aria-expanded={active === v.slug}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-forest-900 px-3 py-1 text-xs font-bold text-emerald2-light">
                          {v.type}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-slate2">
                          <MapPin className="h-4 w-4" /> {v.location}
                        </span>
                      </div>
                      <h2 className="mt-2 font-display text-xl font-bold text-forest-950">
                        {v.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate2">{v.summary}</p>
                    </div>
                    <span className="btn-ghost shrink-0 !px-5 !py-2.5 !text-sm">
                      <Briefcase className="h-4 w-4" />{" "}
                      {active === v.slug ? "Close" : "View & Apply"}
                    </span>
                  </button>

                  {active === v.slug && (
                    <div className="border-t border-forest-900/10 bg-mist/60 p-7">
                      <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                          <h3 className="font-display font-bold text-forest-950">
                            {c("responsibilities")}
                          </h3>
                          <ul className="mt-3 space-y-2">
                            {v.responsibilities.map((r) => (
                              <li
                                key={r}
                                className="flex gap-2.5 text-sm text-slate-700"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald2" />{" "}
                                {r}
                              </li>
                            ))}
                          </ul>
                          <h3 className="mt-6 font-display font-bold text-forest-950">
                            {c("requirements")}
                          </h3>
                          <ul className="mt-3 space-y-2">
                            {v.requirements.map((r) => (
                              <li
                                key={r}
                                className="flex gap-2.5 text-sm text-slate-700"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald2" />{" "}
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="card p-6">
                          {status === "done" ? (
                            <div className="py-8 text-center">
                              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald2" />
                              <h3 className="mt-3 font-display text-xl font-extrabold text-forest-950">
                                {c("application_received")}
                              </h3>
                              <p className="mt-2 text-sm text-slate2">
                                {message}
                              </p>
                              <button
                                onClick={() => {
                                  setStatus("idle");
                                  setActive(null);
                                }}
                                className="btn-ghost mt-5"
                              >
                                {c("browse_other_roles")}
                              </button>
                            </div>
                          ) : (
                            <form onSubmit={apply} className="space-y-4">
                              <input
                                type="hidden"
                                name="career_slug"
                                value={v.slug}
                              />
                              <input
                                type="hidden"
                                name="career_title"
                                value={v.title}
                              />
                              <div>
                                <label
                                  htmlFor={`name-${v.slug}`}
                                  className="label"
                                >
                                  {c("full_name")}
                                </label>
                                <input
                                  id={`name-${v.slug}`}
                                  name="applicant_name"
                                  required
                                  className="input"
                                  placeholder={c("your_full_name")}
                                />
                              </div>
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <label
                                    htmlFor={`email-${v.slug}`}
                                    className="label"
                                  >
                                    {c("email")}
                                  </label>
                                  <input
                                    id={`email-${v.slug}`}
                                    name="email"
                                    type="email"
                                    required
                                    className="input"
                                    placeholder={c("you_email_com")}
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor={`phone-${v.slug}`}
                                    className="label"
                                  >
                                    {c("phone")}
                                  </label>
                                  <input
                                    id={`phone-${v.slug}`}
                                    name="phone"
                                    type="tel"
                                    className="input"
                                    placeholder="+254 …"
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor={`portfolio-${v.slug}`}
                                  className="label"
                                >
                                  {c("portfolio_linkedin_url")}
                                </label>
                                <input
                                  id={`portfolio-${v.slug}`}
                                  name="portfolio_url"
                                  type="url"
                                  className="input"
                                  placeholder={c("https")}
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor={`cover-${v.slug}`}
                                  className="label"
                                >
                                  {c("cover_letter")}
                                </label>
                                <textarea
                                  id={`cover-${v.slug}`}
                                  name="cover_letter"
                                  required
                                  rows={5}
                                  className="input"
                                  placeholder={c("why_are_you_a_good_fit_for")}
                                />
                              </div>
                              <input
                                type="text"
                                name="website"
                                className="hidden"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden
                              />
                              {status === "error" && (
                                <p
                                  role="alert"
                                  className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                                >
                                  {message}
                                </p>
                              )}
                              <button
                                type="submit"
                                disabled={status === "loading"}
                                className="btn-primary w-full disabled:opacity-60"
                              >
                                {status === "loading" ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />{" "}
                                    {c("submitting")}
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4" />{" "}
                                    {c("submit_application")}
                                  </>
                                )}
                              </button>
                              <p className="flex items-center justify-center gap-1.5 text-xs text-slate2">
                                <Clock className="h-3.5 w-3.5" />{" "}
                                {c(
                                  "we_respond_to_shortlisted_candidates_within_10",
                                )}
                              </p>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-16">
          <div className="card p-8 text-center">
            <SectionHeading
              align="center"
              eyebrow={c("technical_collaborations")}
              title={c("not_a_job_but_a_collaboration")}
              description={c(
                "freelancers_researchers_and_technical_partners_tell_us",
              )}
            />
            <a href="/contact?kind=partnership" className="btn-primary mt-6">
              {c("get_in_touch")}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
