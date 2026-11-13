import { z } from "zod";
import { organizerAuthConfigured } from "@/lib/organizer-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";

const schema = z.object({ email: z.email().trim().max(254) });

export async function POST(request: Request) {
  if (!organizerAuthConfigured) {
    return Response.json({ error: "Arrangörsinloggningen är inte konfigurerad ännu." }, { status: 503 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Skriv in en giltig mejladress." }, { status: 400 });

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const supabase = getSupabaseAdmin();
  await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/auth/bekrafta`,
    },
  });

  // Return the same response whether the address exists or not.
  return Response.json({ ok: true });
}

