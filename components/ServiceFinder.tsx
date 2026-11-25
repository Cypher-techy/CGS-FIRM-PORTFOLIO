"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
export type ServiceGroup = {
  name: string;
  art: string;
  services: { slug: string; title: string; summary: string }[];
};
export default function ServiceFinder({
  groups,
  label,
}: {
  groups: ServiceGroup[];
  label: string;
}) {
  const id = useId(),
    [index, select] = useState(0),
    tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = groups[index] ?? groups[0];
  if (!active) return null;
  return (
    <div className="service-finder">
      <div className="finder-menu">
        <p className="finder-label" id={`${id}-label`}>
          {label}
        </p>
        <select
          className="input finder-select"
          aria-labelledby={`${id}-label`}
          value={index}
          onChange={(e) => select(Number(e.target.value))}
        >
          {groups.map((g, i) => (
            <option value={i} key={g.name}>
              {g.name}
            </option>
          ))}
        </select>
        <div
          className="finder-tabs"
          role="tablist"
          aria-orientation="vertical"
          aria-labelledby={`${id}-label`}
        >
          {groups.map((g, i) => (
            <button
              key={g.name}
              type="button"
              ref={(node) => {
                tabs.current[i] = node;
              }}
              id={`${id}-tab-${i}`}
              role="tab"
              aria-controls={`${id}-panel-${i}`}
              aria-selected={i === index}
              tabIndex={i === index ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => {
                const next =
                  e.key === "ArrowDown"
                    ? (i + 1) % groups.length
                    : e.key === "ArrowUp"
                      ? (i + groups.length - 1) % groups.length
                      : e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? groups.length - 1
                          : null;
                if (next !== null) {
                  e.preventDefault();
                  select(next);
                  tabs.current[next]?.focus();
                }
              }}
            >
              <span className="finder-no">
                {String(i + 1).padStart(2, "0")}
              </span>
              {g.name}
              <ArrowRight size={16} />
            </button>
          ))}
        </div>
      </div>
      <div className="finder-results">
        {groups.map((g, i) => (
          <section
            key={g.name}
            hidden={index !== i}
            role="tabpanel"
            id={`${id}-panel-${i}`}
            aria-label={g.name}
          >
            <div className="finder-plate">
              <img
                width="460"
                height="150"
                loading="lazy"
                src={`/field/${g.art}.svg`}
                alt=""
              />
              <span>
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(groups.length).padStart(2, "0")}
              </span>
            </div>
            <h3>{g.name}</h3>
            <ul>
              {g.services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>
                    <span>
                      <strong>{s.title}</strong>
                      <small>{s.summary}</small>
                    </span>
                    <ArrowUpRight size={17} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
