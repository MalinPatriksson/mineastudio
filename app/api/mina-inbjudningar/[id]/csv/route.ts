import { getOrganizerSession } from "@/lib/organizer-auth";
import { getOrganizerInvitation } from "@/lib/organizer-data";

export const runtime = "nodejs";

function csvCell(value: string | number | null) {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getOrganizerSession();
  if (!session) return Response.json({ error: "Du behöver logga in." }, { status: 401 });

  const { id } = await params;
  const invitation = await getOrganizerInvitation(session.userId, id);
  if (!invitation) return Response.json({ error: "Inbjudan kunde inte hittas." }, { status: 404 });

  const rows = [
    ["Gäst", "Svar", "Antal personer", "Allergier och kost", "Meddelande", "Registrerat"],
    ...invitation.responses.map((response) => [
      response.guestName,
      response.attendance === "yes" ? "Kommer" : "Tackat nej",
      response.attendance === "yes" ? response.partySize : "",
      response.allergies,
      response.message,
      new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Stockholm" }).format(new Date(response.respondedAt)),
    ]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(";")).join("\r\n")}`;
  const safeTitle = invitation.title.toLowerCase().replace(/[^a-z0-9åäö]+/gi, "-").replace(/^-|-$/g, "") || "gastlista";

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${safeTitle}-gastlista.csv"`,
      "cache-control": "private, no-store",
    },
  });
}

