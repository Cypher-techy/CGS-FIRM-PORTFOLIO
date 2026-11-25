"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowUpRight, Menu, X } from "lucide-react";
const defaultLinks = [
  ["Home", "/"],
  ["About", "/about"],
  ["Divisions", "/divisions"],
  ["Services", "/services"],
  ["Portfolio", "/projects"],
  ["Insights", "/insights"],
];
const defaultMore = [
  ["Products", "/products"],
  ["Industries", "/industries"],
  ["Research", "/research"],
  ["Partnerships", "/partnerships"],
  ["Careers", "/careers"],
];
export default function Navbar({
  nav = [],
  extraNav = [],
}: {
  nav?: string[][];
  extraNav?: string[][];
}) {
  const listed = nav.length ? nav : defaultLinks;
  const links = listed.slice(0, 6),
    more = [
      ...listed.slice(6),
      ...(extraNav.length ? extraNav : defaultMore),
    ].filter(([_, url]) => !links.some((x) => x[1] === url));
  const path = usePathname(),
    [open, set] = useState(false),
    [extra, menu] = useState(false);
  useEffect(() => {
    set(false);
    menu(false);
  }, [path]);
  if (path.startsWith("/admin")) return null;
  return (
    <header
      className="mast"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          set(false);
          menu(false);
        }
      }}
    >
      <div className="container-x flex h-[76px] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Cypher Green Systems home"
        >
          <img
            className="h-auto w-[83px]"
            src="/brand/cgs-mark.webp"
            alt="CGS"
            width="280"
            height="109"
          />
          <span className="brand-long">
            Cypher Green
            <br />
            Systems
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 lg:flex xl:gap-7"
        >
          {links.map(([label, url]) => (
            <Link
              href={url}
              key={url}
              aria-current={path === url ? "page" : undefined}
              className="navlink"
            >
              {label}
            </Link>
          ))}
          <div
            className="relative"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) menu(false);
            }}
          >
            <button
              className="navlink flex items-center gap-1"
              aria-expanded={extra}
              onClick={() => menu(!extra)}
            >
              More <ChevronDown size={13} />
            </button>
            {extra && (
              <div className="nav-menu">
                {more.map(([l, u]) => (
                  <Link href={u} key={u}>
                    {l}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="contact-nav">
            Contact Us <ArrowUpRight size={16} />
          </Link>
          <button
            className="lg:hidden"
            onClick={() => set(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="nav-menu mobile-nav">
          {[...links, ...more].map(([l, u]) => (
            <Link href={u} key={u}>
              {l}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
