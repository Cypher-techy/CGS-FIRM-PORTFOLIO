export function linksFrom(raw: unknown, external = false): string[][] {
  return Array.isArray(raw)
    ? raw.filter(
        (x): x is string[] =>
          Array.isArray(x) &&
          x.length === 2 &&
          x.every((v) => typeof v === "string") &&
          (external ? /^https:\/\// : /^\/(?![\/\\])/).test(x[1]),
      )
    : [];
}
