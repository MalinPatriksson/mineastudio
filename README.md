# Minea Studio — Digital Invitation Studio

En första lokal prototyp av en svensk webbshop för interaktiva digitala inbjudningar.

## Starta lokalt

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## Viktiga vyer

- `/` — startsida och kollektion
- `/studio/rosendrom` — live-editor för barnkalasmallen
- `/studio/nattblomma` — live-editor för bröllopsmallen
- `/studio/lilla-molnet` — live-editor för dop- och namngivningsmallen
- `/i/rosendrom` — simulerad publicerad inbjudan

## Arkitektur

Mallarna registreras i `lib/invitations.ts` med gemensam datamodell, rekommenderade funktioner och visuell palett. `InvitationRenderer` används både i editorn och i den publicerade demon så att resultatet blir identiskt. En ny mall kan läggas till i registret utan att själva köp- eller editorflödet behöver byggas om.

## Kontroller

```bash
npm run lint
npm run typecheck
npm run build
```

## OSA-backend (Supabase)

Fas A är förberedd för riktig, privat lagring. Kopiera `.env.example` till `.env.local` och konfigurera:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` – endast server, får aldrig exponeras som `NEXT_PUBLIC_*`
- `RSVP_RATE_LIMIT_SALT` – en lång slumpad hemlighet
- `INVITATION_RETENTION_DAYS` – standard `90`

Kör `supabase/migrations/202611120001_phase_a_rsvp.sql` i Supabase SQL Editor eller via Supabase CLI. Utan värdena fungerar OSA-flödet som en tydligt märkt förhandsvisning och inga svar påstås vara sparade.

Se [den tekniska planen](docs/technical-plan.md) för arkitektur och kommande faser.
