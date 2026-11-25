import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — SERVER ONLY. Never import this in client components.
 * Used for privileged operations (notifications, admin data access) after
 * server-side authorisation checks.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
