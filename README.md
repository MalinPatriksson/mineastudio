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
