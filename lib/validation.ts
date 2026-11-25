import { z } from "zod";

const email = z.string().trim().email("Please enter a valid email address.");
const str = (max = 2000) =>
  z.string().trim().min(2, "This field is required.").max(max);

export const inquirySchema = z.object({
  kind: z
    .enum(["general", "quotation", "consultation", "partnership", "service"])
    .default("general"),
  name: str(120),
  email,
  organisation: z.string().trim().max(200).optional().default(""),
  subject: z.string().trim().max(200).optional().default(""),
  message: str(5000),
  website: z.string().optional(), // honeypot
});

export const applicationSchema = z.object({
  career_slug: z.string().trim().min(1),
  career_title: z.string().trim().min(1),
  applicant_name: str(120),
  email,
  phone: z.string().trim().max(40).optional().default(""),
  cover_letter: str(5000),
  portfolio_url: z
    .union([z.string().trim().url("Please enter a valid URL."), z.literal("")])
    .optional()
    .default(""),
  website: z.string().optional(),
});

export const partnershipSchema = z.object({
  partnership_type: str(120),
  organisation: str(200),
  contact_name: str(120),
  email,
  phone: z.string().trim().max(40).optional().default(""),
  proposal: str(8000),
  website: z.string().optional(),
});

/** Simple in-memory rate limiter (per IP + endpoint). */
const hits = new Map<string, number[]>();
export function rateLimited(
  key: string,
  limit = 10,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  if (hits.size > 10000)
    for (const [k, ts] of Array.from(hits))
      if (ts[ts.length - 1] < now - windowMs) hits.delete(k);
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) return true;
  arr.push(now);
  hits.set(key, arr);
  return false;
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
