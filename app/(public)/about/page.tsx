import { copyFor } from "@/lib/content";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Target,
  Heart,
  Compass,
  Users,
  Award,
  Lightbulb,
  ShieldCheck,
  Leaf,
  Handshake,
  GraduationCap,
} from "lucide-react";
import { PageHero, Reveal, SectionHeading } from "@/components/ui";

const VALUES = [
  {
    icon: Lightbulb,
    name: "Innovation",
    desc: "We pursue better ways to solve real problems — in technology, in environmental practice, and in how we work.",
  },
  {
    icon: ShieldCheck,
    name: "Integrity",
    desc: "Honest advice, transparent methods and evidence-based claims. Our credibility is our most valuable asset.",
  },
  {
    icon: Award,
    name: "Excellence",
    desc: "Professional standards in every deliverable — from a single map to a full enterprise system.",
  },
  {
    icon: Leaf,
    name: "Sustainability",
    desc: "Environmental responsibility is not a department at CGS; it is the lens through which we see every project.",
  },
  {
    icon: Handshake,
    name: "Collaboration",
    desc: "We build with clients and partners, not just for them — sharing knowledge and ownership along the way.",
  },
  {
    icon: Compass,
    name: "Accountability",
    desc: "We own our commitments: clear scopes, clear deliverables, clear communication.",
  },
  {
    icon: GraduationCap,
    name: "Continuous Learning",
    desc: "Technology and environmental science move fast. So do we — through research, experimentation and reflection.",
  },
];

export default async function AboutPage() {
  const content = await copyFor("about");
  const c = (key: string, fallback = key) => content[key] ?? fallback;

  return (
    <>
      <PageHero
        eyebrow={c("about_cgs")}
        title={c("technology_environment_opportunity")}
        description={c(
          "cypher_green_systems_is_a_multidisciplinary_technology",
        )}
      />

      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow={c("company_overview")}
            title={c("a_multidisciplinary_firm_for_practical_problems")}
            description={c(
              "cgs_combines_environmental_science_geospatial_intelligence_software",
            )}
          />
          <Reveal delay={0.1}>
            <div className="space-y-4 leading-relaxed text-slate-700">
              <p>
                {c(
                  "we_serve_businesses_institutions_communities_and_development",
                )}{" "}
              </p>
              <p>{c("our_six_business_divisions_work_as_one")} </p>
              <p>
                {c(
                  "alongside_client_work_we_develop_proprietary_products",
                )}{" "}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full p-8">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-900 text-emerald2-light">
                <Eye className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-forest-950">
                {c("our_vision")}
              </h2>
              <blockquote className="mt-3 border-l-4 border-emerald2 pl-4 text-lg italic leading-relaxed text-slate-700">
                {c(
                  "to_become_a_leading_multidisciplinary_firm_delivering",
                )}{" "}
              </blockquote>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card h-full p-8">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-900 text-emerald2-light">
                <Target className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-forest-950">
                {c("our_mission")}
              </h2>
              <blockquote className="mt-3 border-l-4 border-emerald2 pl-4 text-lg italic leading-relaxed text-slate-700">
                {c("to_develop_and_deliver_practical_technology_driven")}{" "}
              </blockquote>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20">
        <SectionHeading
          align="center"
          eyebrow={c("core_values")}
          title={c("what_guides_every_engagement")}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={c(v.name, v.name)} delay={i * 0.05}>
              <div className="card h-full p-6">
                <v.icon className="h-7 w-7 text-emerald2" />
                <h3 className="mt-3 font-display text-lg font-bold text-forest-950">
                  {c(v.name, v.name)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate2">
                  {c(v.desc, v.desc)}
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.35}>
            <div className="flex h-full flex-col justify-center rounded-xl2 bg-forest-950 p-6 text-white">
              <Heart className="h-7 w-7 text-emerald2-light" />
              <h3 className="mt-3 font-display text-lg font-bold">
                {c("our_philosophy")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {c("technology_should_serve_people_and_planet_every")}{" "}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={c("business_approach")}
              title={c("how_we_work_with_clients")}
              description={c(
                "a_disciplined_transparent_approach_from_first_conversation",
              )}
            />
            <ol className="mt-8 space-y-5">
              {[
                [
                  c("discover"),
                  c("we_listen_first_understanding_the_problem_the"),
                ],
                [
                  c("design"),
                  c("we_scope_the_work_precisely_deliverables_methods"),
                ],
                [
                  c("deliver"),
                  c("we_build_and_analyse_with_professional_rigour"),
                ],
                [
                  c("document_hand_over"),
                  c("every_engagement_ends_with_documentation_training_and"),
                ],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.07}>
                  <li className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-900 font-display font-extrabold text-emerald2-light">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-forest-950">
                        {t}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate2">
                        {d}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal delay={0.1}>
            <div className="card p-8">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-900 text-emerald2-light">
                <Users className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-forest-950">
                {c("leadership_organisation")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate2">
                {c("cgs_is_organised_into_six_business_divisions")}{" "}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate2">
                {c("our_portfolio_documents_the_firm_s_work")}{" "}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/divisions" className="btn-primary">
                  {c("explore_divisions")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="btn-ghost">
                  {c("talk_to_us")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20">
        <Reveal>
          <div className="topo-bg rounded-xl2 bg-forest-950 p-10 text-center text-white sm:p-14">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold">
              {c("work_with_a_firm_that_means_it")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              {c(
                "whether_you_need_environmental_expertise_geospatial_intelligence",
              )}{" "}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-emerald">
                {c("contact_cgs")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/partnerships" className="btn-ghost-dark">
                {c("partner_with_cgs")}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export const metadata = { title: "About" };
