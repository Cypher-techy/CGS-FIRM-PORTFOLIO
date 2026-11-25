import { createBrowserClient } from "@supabase/ssr";
import { publicSupabaseConfig } from "./public-config";
export { isSupabaseConfigured } from "./public-config";

export function createClient() {
  const { url, key } = publicSupabaseConfig();
  return createBrowserClient(url, key);
}
