import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const organizerSessionCookie = "minea-organizer";
const sessionLifetimeSeconds = 60 * 60 * 24 * 30;

export type OrganizerSession = {
  userId: string;
  email: string;
  expiresAt: number;
};

function sessionSecret() {
  return process.env.ORGANIZER_SESSION_SECRET ?? process.env.RSVP_RATE_LIMIT_SALT;
}

function signature(value: string) {
  const secret = sessionSecret();
  if (!secret) throw new Error("Arrangörsinloggningen saknar sessionshemlighet.");
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createOrganizerSession(userId: string, email: string) {
  const payload: OrganizerSession = {
    userId,
    email,
    expiresAt: Math.floor(Date.now() / 1000) + sessionLifetimeSeconds,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return { value: `${encoded}.${signature(encoded)}`, maxAge: sessionLifetimeSeconds };
}

export function verifyOrganizerSession(value?: string): OrganizerSession | null {
  if (!value || !sessionSecret()) return null;
  const [encoded, suppliedSignature] = value.split(".");
  if (!encoded || !suppliedSignature) return null;

  const expectedSignature = signature(encoded);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as OrganizerSession;
    if (!payload.userId || !payload.email || payload.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getOrganizerSession() {
  const cookieStore = await cookies();
  return verifyOrganizerSession(cookieStore.get(organizerSessionCookie)?.value);
}

export const organizerAuthConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  sessionSecret(),
);

