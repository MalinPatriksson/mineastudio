import { cookies } from "next/headers";
import { z } from "zod";
import { createOrganizerSession, organizerAuthConfigured, organizerSessionCookie } from "@/lib/organizer-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";

const schema = z.object({ accessToken: z.string().min(20).max(6000) });

export async function POST(request: Request) {
  if (!organizerAuthConfigured) return Response.json({ error: "Inloggningen är inte konfigurerad." }, { status: 503 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Den säkra länken är ogiltig." }, { status: 400 });

  const { data, error } = await getSupabaseAdmin().auth.getUser(parsed.data.accessToken);
  if (error || !data.user?.email) return Response.json({ error: "Länken är ogiltig eller har gått ut." }, { status: 401 });

  const session = createOrganizerSession(data.user.id, data.user.email);
  const cookieStore = await cookies();
  cookieStore.set(organizerSessionCookie, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: session.maxAge,
    priority: "high",
  });
  return Response.json({ ok: true });
}

