# Minea Studio – designinventering och utbyggnadsplan

## Befintliga sex designer

Alla sex använder `InvitationRenderer` för samma personuppgifter, funktionsknappar, OSA, karta, kalender, automatisk densitet, kuvert och publicerad vy. Skillnaderna ligger främst i illustration, palett och bakgrundsrörelse:

- **Rosendröm** – puderrosa akvarellvärld, blom- och rosettdetaljer, blommande bakgrundsrörelse.
- **Äppelblom** – trädgårdsillustration i aprikos och salvia, samma klassiska innehållsstruktur men egen bildvärld.
- **Sandlöfte** – sand/linne, botaniska blad och bågformad komposition.
- **Nattblomma** – midnattsblå stjärnhimmel, guldstjärnor och mörkt kuvert.
- **Lilla molnet** – disblå himmel, moln och mjuka stjärnglimtar.
- **Olivkvist** – botanisk papperskänsla med rörliga olivblad.

Kuvertet är gemensamt men färgsätts via mallens palett och visar mallens konst på brevet. Färgteman sätts med CSS-variabler så text, ytor, knappar och kuvert följer samma kontrastsäkra system.

## Ny arkitektur

`InvitationTemplate.layout` väljer en strukturell upplevelse. Gemensamma data och funktioner ligger kvar i renderern, medan layouten får egna DOM-lager, CSS-komposition, öppning och rörelsesignatur.

| Layout | Designer | Struktur |
|---|---|---|
| `storybook` | Sagoskogen | Hög, scrollande sagobok med bildlager och kapitelmarkörer |
| `poster` | Konfettikalas | Grafisk affisch med stora bokstäver och färgblock |
| `editorial` | Tidlös | Asymmetrisk grid med vertikal typografisk räls |
| `cinematic` | Gyllene timmen | Helskärmsfoto med separata glasliknande informationskapitel |
| `celestial` | Månskimmer | Rund himmelsk medaljong med kretsande stjärnor |
| `vintage` | Nallekram | Illustrerad arvsram och mjuk vintagekomposition |
| `patisserie` | Körsbärsdröm | Vågiga kanter, markis och utvikbar konditorikänsla |
| `deco` | Guldkant | Geometrisk art déco-scen med pampig panelöppning |
| `ticket` | Gyllene biljetten | Perforerad biljett med separat biljettstubbe |
| `postcard` | Citronlunden | Tvåsidigt vykort som gästen vänder |

## Implementationsprinciper

1. Alla layouter använder samma validerade `InvitationData`, OSA-läge och funktionssystem.
2. På- och avslagning av funktioner går genom Framer Motion-layout och densitetsklasser.
3. `Stilla`, `Mjuk` och `Lekfull` styr både gemensamma dekorlager och mallens egen rörelsesignatur.
4. `TemplateArt` använder samma mallmetadata för startsida och kategorikort.
5. Nya kategorier definieras en gång i `invitationCategories` och återanvänds av startsida, mobilmeny, kategorisidor och sitemap.
6. Varje ny mall testas i studions telefonram och i den öppnade slutproduktvyn.
