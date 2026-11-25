"use client";
import { useCopy, useBusinessContact } from "@/components/CopyContext";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  MapPin,
  Globe,
  Loader2,
  CheckCircle2,
  Send,
  MessageSquare,
  FileText,
  Handshake,
  HelpCircle,
} from "lucide-react";
import { PageHero, Reveal, SectionHeading } from "@/components/ui";

const KINDS = [
  { value: "general", label: "General Inquiry", icon: HelpCircle },
  { value: "quotation", label: "Request a Quotation", icon: FileText },
  {
    value: "consultation",
    label: "Request a Consultation",
    icon: MessageSquare,
  },
  { value: "partnership", label: "Partnership Inquiry", icon: Handshake },
  { value: "service", label: "Service Enquiry", icon: Send },
];

function ContactForm() {
  const c = useCopy("contact");

  const params = useSearchParams();
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
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("done");
      setMessage(
        "Thank you. Your enquiry has been received and our team will respond shortly.",
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
    <div className="card p-8">
      {status === "done" ? (
        <div className="py-10 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald2" />
          <h2 className="mt-4 font-display text-2xl font-extrabold text-action">
            {c("enquiry_received")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-slate2">{message}</p>
          <button onClick={() => setStatus("idle")} className="btn-ghost mt-6">
            {c("send_another_enquiry")}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label htmlFor="kind" className="label">
              {c("enquiry_type")}
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {KINDS.map((k) => (
                <label key={k.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="kind"
                    value={k.value}
                    defaultChecked={
                      (params.get("kind") ||
                        (params.get("service") ? "service" : "general")) ===
                      k.value
                    }
                    className="peer sr-only"
                  />
                  <span className="flex flex-col items-center gap-1.5 rounded-xl border border-line px-3 py-3 text-center text-xs font-bold text-action transition peer-checked:border-emerald2 peer-checked:bg-emerald2/10 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald2">
                    <k.icon className="h-5 w-5" /> {k.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="label">
                {c("full_name")}
              </label>
              <input
                id="name"
                name="name"
                required
                className="input"
                placeholder={c("your_full_name")}
              />
            </div>
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
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="organisation" className="label">
                {c("organisation")}
              </label>
              <input
                id="organisation"
                name="organisation"
                className="input"
                placeholder={c("company_institution")}
              />
            </div>
            <div>
              <label htmlFor="subject" className="label">
                {c("subject")}
              </label>
              <input
                id="subject"
                name="subject"
                className="input"
                defaultValue={
                  params.get("service") ||
                  params.get("product") ||
                  params.get("division") ||
                  ""
                }
                placeholder={c("what_is_this_about")}
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="label">
              {c("message")}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="input"
              placeholder={c("tell_us_about_your_project_needs_or")}
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
                <Loader2 className="h-4 w-4 animate-spin" /> {c("sending")}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> {c("send_enquiry")}
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate2">
            {c("we_respond_to_all_serious_enquiries_your")}
          </p>
        </form>
      )}
    </div>
  );
}

export default function ContactPage() {
  const business = useBusinessContact();
  const c = useCopy("contact");

  return (
    <>
      <PageHero
        eyebrow={c("contact")}
        title={c("talk_to_cypher_green_systems")}
        description={c(
          "corporate_enquiries_quotations_consultations_and_partnerships_categorised",
        )}
      />
      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeading
              eyebrow={c("business_contact")}
              title={c("start_a_conversation")}
              description={c("tell_us_about_your_organisation_and_what")}
            />
            <Reveal delay={0.1}>
              <div className="mt-8 space-y-4">
                {business.email && (
                  <a
                    className="card flex gap-2 p-5"
                    href={`mailto:${business.email}`}
                  >
                    <Mail size={18} />
                    {business.email}
                  </a>
                )}
                {business.location && (
                  <p className="card flex gap-2 p-5">
                    <MapPin size={18} />
                    {business.location}
                  </p>
                )}
                {[
                  {
                    icon: MessageSquare,
                    label: "Business enquiries",
                    value: "Quotations & consultations",
                  },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="card flex items-center gap-4 p-5"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-900 text-emerald2-light">
                      <c.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate2">
                        {c.label}
                      </p>
                      <p className="font-display font-bold text-action">
                        {c.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-6 rounded-xl2 bg-forest-950 p-7 text-white">
                <h3 className="font-display text-lg font-bold">
                  {c("what_happens_next")}
                </h3>
                <ol className="mt-4 space-y-3 text-sm text-white/75">
                  <li className="flex gap-3">
                    <span className="font-display font-extrabold text-emerald2-light">
                      1.
                    </span>{" "}
                    {c("your_enquiry_is_logged_and_categorised")}
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display font-extrabold text-emerald2-light">
                      2.
                    </span>{" "}
                    {c("the_relevant_division_reviews_it")}
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display font-extrabold text-emerald2-light">
                      3.
                    </span>{" "}
                    {c("we_respond_with_next_steps")}
                  </li>
                </ol>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Suspense
              fallback={
                <div className="card p-8 text-slate2">{c("loading_form")}</div>
              }
            >
              <ContactForm />
            </Suspense>
          </Reveal>
        </div>
      </section>
    </>
  );
}
