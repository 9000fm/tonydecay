import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

function makeClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      `Supabase admin client missing env - url=${url ? "set" : "MISSING"} service_role=${key ? "set" : "MISSING"}. Populate NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.`,
    );
  }
  return createClient(url, key);
}

export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    if (!cached) cached = makeClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (cached as any)[prop];
  },
});
