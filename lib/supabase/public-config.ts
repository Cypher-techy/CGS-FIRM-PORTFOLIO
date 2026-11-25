// Keep public env references explicit so Next.js can inline them for browser clients.
export function publicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
  return { url, key };
}

export function isSupabaseConfigured() {
  const { url, key } = publicSupabaseConfig();
  return Boolean(url && key);
}
