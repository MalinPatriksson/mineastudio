# Minea Studio – teknisk plan

## Nuläge

Minea är en Next.js 16-applikation med en gemensam renderer för studio och publicerad inbjudan. Fas A lägger en servergräns och ett Supabase-schema under den befintliga designen utan att bygga om mallmotorn.

## Fas A – implementerad grund

- OSA-läge per inbjudan: formulär, SMS eller inget.
- Enkla val för antal personer, allergier/kost och meddelande.
- Servervaliderad Route Handler i `app/api/rsvp/route.ts`.
- Supabase-tabeller för inbjudningar och OSA-svar.
- Row Level Security: arrangörer kan endast läsa sina egna inbjudningar och svar.
- Gäster går alltid via server-API:t; service role-nyckeln exponeras aldrig i webbläsaren.
- Personlig redigeringsnyckel lagras endast hashad. Rånyckeln ligger i URL-fragmentet och skickas därför inte som referrer.
- Honeypot, längdgränser och IP/klient-hashat frekvensskydd.
- Demomallar visar hela flödet men märker tydligt att svaret inte sparas.

## Datamodell

`invitations` blir den centrala posten för ett köpt evenemang. Den innehåller ägare, publik token, mall, innehåll, funktioner, OSA-inställningar, betalnings/publiceringsstatus och giltighetstid.

`rsvp_responses` innehåller ett svar per personlig redigeringsnyckel. Antal svarande sällskap är antalet rader; antal gäster som kommer är summan av `party_size` där `attendance = 'yes'`.

## Nästa steg

### Fas B

1. Supabase Auth med magic link.
2. Privat `/mina-inbjudningar` med serverkontrollerad session.
3. Statistik, gästlista och CSV-export.
4. Redigering av köpt `invitation_data` på samma publika token.

### Fas C

1. Stripe Checkout i testläge.
2. Idempotent webhook med unikt Stripe event-ID.
3. Skapa/publicera inbjudan endast efter verifierad `checkout.session.completed`.
4. Koppla köp till den verifierade mejladressen och skicka bekräftelsemejl.

### Fas D

Full kundresa, tillgänglighet, mobil QA och animation/layout-polering.

## Giltighet

Standardvärdet är 90 dagar efter evenemanget och styrs av `INVITATION_RETENTION_DAYS`. Vid skapande efter betalning ska `expires_at` sättas från evenemangsdatum plus det aktuella värdet.

