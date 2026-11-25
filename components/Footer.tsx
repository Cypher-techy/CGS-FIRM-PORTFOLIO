import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About CGS" },
      { href: "/divisions", label: "Business Divisions" },
      { href: "/research", label: "Research & Innovation" },
      { href: "/insights", label: "Insights & Publications" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "What We Do",
    links: [
      { href: "/services", label: "Services" },
      { href: "/products", label: "Products & Platforms" },
      { href: "/projects", label: "Projects & Portfolio" },
      { href: "/industries", label: "Industries Served" },
      { href: "/partnerships", label: "Partnerships" },
    ],
  },
  {
    title: "Products",
    links: [
      { href: "/products/cypher-terra", label: "Cypher Terra" },
      { href: "/products/edvora-lms", label: "Edvora LMS" },
      { href: "/products/cypher-fx", label: "Cypher FX" },
      {
        href: "/products/chalar-farm-inventory",
        label: "Chalar Farm Inventory",
      },
    ],
  },
];

export default function Footer({
  description = "A multidisciplinary technology and environmental solutions firm delivering practical solutions for a smarter, more resilient future.",
  products = [],
  custom = [],
  social = [],
  email = "",
}: {
  description?: string;
  products?: { slug: string; name: string }[];
  custom?: string[][];
  social?: string[][];
  email?: string;
}) {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/brand/cgs-mark.webp"
              alt="CGS"
              width="95"
              height="37"
              className="p-1"
            />
            <div className="leading-tight">
              <p className="font-display text-lg font-extrabold">
                Cypher Green Systems
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald2-light">
                Technology · Environment · Opportunity
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            {description}
          </p>
          {email && (
            <p className="mt-3">
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          )}
          {social.map(([label, url]) => (
            <a
              className="mr-3 underline"
              href={url}
              key={url}
              rel="noreferrer"
              target="_blank"
            >
              {label}
            </a>
          ))}
          <Link
            className="mt-5 inline-flex items-center gap-2 text-sm text-emerald2-light"
            href="/contact"
          >
            Contact the team <ArrowRight size={15} />
          </Link>
        </div>
        {(custom.length
          ? [
              {
                title: "Explore",
                links: custom.map(([label, href]) => ({ label, href })),
              },
            ]
          : COLUMNS
        ).map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-emerald2-light">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {(col.title === "Products"
                ? products.map((p) => ({
                    label: p.name,
                    href: `/products/${p.slug}`,
                  }))
                : col.links
              ).map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white"
                  >
                    {l.label}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Cypher Green Systems (CGS). All rights
            reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link href="/partnerships" className="hover:text-white">
              Partner With CGS
            </Link>
            <Link href="/admin" className="hover:text-white">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
