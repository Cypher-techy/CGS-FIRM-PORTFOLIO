"use client";
import { useCopy } from "@/components/CopyContext";

import { useState } from "react";
import {
  Handshake,
  Building2,
  Cpu,
  FlaskConical,
  Leaf,
  Globe2,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { PageHero, Reveal, SectionHeading } from "@/components/ui";

const TYPES = [
  {
    icon: Building2,
    title: "Institutional Partnerships",
    desc: "Universities, research institutions and public bodies building long-term capability together.",
  },
  {
    icon: Cpu,
    title: "Technology Partnerships",
    desc: "Platform, data and infrastructure partners extending what CGS can deliver.",
  },
  {
    icon: FlaskConical,
    title: "Research Collaborations",
    desc: "Joint applied research in environmental and geospatial science.",
  },
  {
    icon: Leaf,
    title: "Environmental Partnerships",
    desc: "Conservation and sustainability programmes with measurable outcomes.",
  },
  {
    icon: Globe2,
    title: "Development Organisations",
    desc: "NGOs and development partners scaling impact through technology.",
  },
  {
    icon: Briefcase,
    title: "Corporate Clients",
    desc: "Businesses seeking a reliable technology and environmental partner.",
  },
  {
    icon: TrendingUp,
    title: "Investment & Strategic Collaboration",
    desc: "Strategic alliances and investment discussions aligned with our growth.",
  },
];

export default function PartnershipsPage() {
  const c = useCopy("partnerships");

  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("done");
      setMessage(
        "Thank you. Your partnership proposal has been received and our team will respond shortly.",
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

  return (
    <>
      <PageHero
        eyebrow={c("partnerships_business_development")}
        title={c("partner_with_cgs")}
        description={c(
          "institutional_technology_research_environmental_and_strategic_partnerships",
        )}
      />
      <section className="container-x py-20">
        <SectionHeading
          eyebrow={c("partnership_types")}
          title={c("how_we_work_together")}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TYPES.map((t, i) => (
            <Reveal key={c(t.title, t.title)} delay={i * 0.04}>
              <div className="card h-full p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-900 text-emerald2-light">
                  <t.icon className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-display text-base font-bold text-forest-950">
                  {c(t.title, t.title)}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate2">
                  {c(t.desc, t.desc)}
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <div className="flex h-full flex-col justify-center rounded-xl2 bg-forest-950 p-6 text-white">
              <Handshake className="h-8 w-8 text-emerald2-light" />
              <h2 className="mt-3 font-display text-base font-bold">
                {c("something_else")}
              </h2>
              <p className="mt-2 text-sm text-white/70">
                {c("if_it_creates_value_for_people_and")}
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow={c("proposal_submission")}
              title={c("submit_a_partnership_proposal")}
              description={c("tell_us_who_you_are_what_you")}
            />
            <Reveal delay={0.1}>
              <ul className="mt-8 space-y-3">
                {[
                  c("reviewed_by_the_cgs_leadership_team"),
                  c("response_within_5_working_days"),
                  c("nda_available_on_request"),
                  c("no_obligation_proposals_are_exploratory"),
                ].map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald2" />{" "}
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="card p-8">
              {status === "done" ? (
                <div className="py-10 text-center">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-emerald2" />
                  <h2 className="mt-4 font-display text-2xl font-extrabold text-forest-950">
                    {c("proposal_received")}
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-slate2">{message}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="btn-ghost mt-6"
                  >
                    {c("submit_another_proposal")}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="organisation" className="label">
                        {c("organisation")}
                      </label>
                      <input
                        id="organisation"
                        name="organisation"
                        required
                        className="input"
                        placeholder={c("your_organisation")}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact_name" className="label">
                        {c("contact_person")}
                      </label>
                      <input
                        id="contact_name"
                        name="contact_name"
                        required
                        className="input"
                        placeholder={c("full_name")}
                      />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className="label">
                        {c("email")}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="input"
                        placeholder={c("you_organisation_org")}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="label">
                        {c("phone")}
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="input"
                        placeholder="+254 …"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="partnership_type" className="label">
                      {c("partnership_type")}
                    </label>
                    <select
                      id="partnership_type"
                      name="partnership_type"
                      required
                      className="input"
                      defaultValue="Institutional Partnership"
                    >
                      {TYPES.map((t) => (
                        <option key={c(t.title, t.title)}>
                          {t.title
                            .replace("Partnerships", "Partnership")
                            .replace("Collaborations", "Collaboration")}
                        </option>
                      ))}
                      <option>{c("investment_strategic_collaboration")}</option>
                      <option>{c("other")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="proposal" className="label">
                      {c("proposal")}
                    </label>
                    <textarea
                      id="proposal"
                      name="proposal"
                      required
                      rows={6}
                      className="input"
                      placeholder={c(
                        "describe_the_partnership_opportunity_your_organisation_and",
                      )}
                    />
                  </div>
                  {/* Honeypot — spam protection */}
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
                        <Handshake className="h-4 w-4" /> {c("submit_proposal")}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
