import { createClient } from "@supabase/supabase-js";

let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        // If we are in build time, we can return a dummy or let it fail only when called
        if (process.env.NEXT_PHASE === 'phase-production-build') {
            return () => {}; // Dummy for build
        }
        throw new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are required.");
      }

      _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      });
    }
    return ( _supabaseAdmin as any)[prop];
  },
});

export const STORAGE_BUCKET = "MyPort";

export function getPublicUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return "";
  return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}
