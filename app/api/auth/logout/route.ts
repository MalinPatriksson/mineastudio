import { cookies } from "next/headers";
import { organizerSessionCookie } from "@/lib/organizer-auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.set(organizerSessionCookie, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return Response.redirect(new URL("/mina-inbjudningar", request.url), 303);
}

