export type AnimationStyle = "none" | "soft" | "playful";
export type Colorway = "signature" | "soft" | "deep" | "beige" | "boy";
export type FeatureKey = "rsvp" | "map" | "calendar" | "countdown" | "greeting";
export type PhotoShape = "organic" | "arch" | "circle";
export type PhotoFrameStyle = "clean" | "fade" | "floral";
export type RsvpMode = "form" | "sms" | "none";
export type InvitationLayout = "classic" | "storybook" | "poster" | "editorial" | "cinematic" | "celestial" | "vintage" | "patisserie" | "deco" | "ticket" | "postcard";
export type RsvpQuestionConfig = {
  partySize: boolean;
  allergies: boolean;
  message: boolean;
};

export const defaultRsvpQuestions: RsvpQuestionConfig = {
  partySize: true,
  allergies: true,
  message: true,
};

export type InvitationData = {
  name: string;
  photoUrl?: string;
  photoPositionX?: number;
  photoPositionY?: number;
  photoShape?: PhotoShape;
  photoFrame?: PhotoFrameStyle;
  age?: string;
  date: string;
  startTime: string;
  endTime?: string;
  address: string;
  kicker: string;
  subtitle: string;
  greeting: string;
  footerText: string;
  countdownLabel: string;
  rsvpHint: string;
  rsvpLabel: string;
  mapHint: string;
  mapLabel: string;
  calendarHint: string;
  calendarLabel: string;
  phone: string;
  rsvpDate: string;
};

export type InvitationTemplate = {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  tagline: string;
  description: string;
  artwork: string;
  layout: InvitationLayout;
  palette: "rose" | "sand" | "midnight" | "sky";
  recommended: FeatureKey[];
  defaultData: InvitationData;
};

export const templates: InvitationTemplate[] = [
  {
    id: "rosendrom",
    name: "Rosendröm",
    category: "Barnkalas",
    categorySlug: "barnkalas",
    price: 59,
    tagline: "Rosetter, blommor och en liten värld av magi.",
    description: "En handmålad kalasdröm i puderrosa, med mjuka rosetter och lekfulla detaljer som vaknar till liv.",
    artwork: "/art/rosendrom-world.jpg",
    layout: "classic",
    palette: "rose",
    recommended: ["rsvp", "map", "calendar"],
    defaultData: {
      name: "Sophia",
      age: "7",
      date: "2027-05-24",
      startTime: "14:00",
      endTime: "16:30",
      address: "Rosendalsvägen 12, Stockholm",
      kicker: "Hurra för",
      subtitle: "7 år av magi!",
      greeting: "Ta på dig något som glittrar och kom och fira med oss!",
      footerText: "Vi längtar efter att fira med dig",
      countdownLabel: "dagar kvar",
      rsvpHint: "Skicka ett svar",
      rsvpLabel: "OSA via SMS",
      mapHint: "Visa vägen",
      mapLabel: "Hitta hit",
      calendarHint: "Spara dagen",
      calendarLabel: "Lägg till i kalender",
      phone: "0701234567",
      rsvpDate: "2027-05-12",
    },
  },
  {
    id: "appelblom",
    name: "Äppelblom",
    category: "Barnkalas",
    categorySlug: "barnkalas",
    price: 59,
    tagline: "Ett soligt trädgårdskalas i aprikos och salvia.",
    description: "En varm, handmålad kalasvärld med äppelblom, vimplar och en liten picknick under träden.",
    artwork: "/art/appelblom-world.png",
    layout: "classic",
    palette: "rose",
    recommended: ["rsvp", "map", "calendar"],
    defaultData: {
      name: "Elsa",
      age: "6",
      date: "2027-06-12",
      startTime: "13:00",
      endTime: "15:30",
      address: "Äppelgården 4, Uppsala",
      kicker: "Välkommen till",
      subtitle: "6 år i blom",
      greeting: "Kom på picknickkalas bland äppelblom och vimplar!",
      footerText: "Det blir en dag att minnas",
      countdownLabel: "dagar till kalaset",
      rsvpHint: "Berätta om du kommer",
      rsvpLabel: "Svara på inbjudan",
      mapHint: "Visa vägen",
      mapLabel: "Hitta till kalaset",
      calendarHint: "Kom ihåg dagen",
      calendarLabel: "Spara kalaset",
      phone: "0701112233",
      rsvpDate: "2027-06-01",
    },
  },
  {
    id: "sandlofte",
    name: "Sandlöfte",
    category: "Bröllop",
    categorySlug: "brollop",
    price: 59,
    tagline: "Varm minimalism i linne, sand och champagne.",
    description: "En mjuk och professionell bröllopsinbjudan med taktil papperskänsla, luft och diskreta botaniska detaljer.",
    artwork: "/art/sandlofte-world.png",
    layout: "classic",
    palette: "sand",
    recommended: ["rsvp", "map", "calendar"],
    defaultData: {
      name: "Alma & Ludvig",
      date: "2027-06-19",
      startTime: "15:00",
      endTime: "23:30",
      address: "Villa Strand, Båstad",
      kicker: "Tillsammans med våra familjer",
      subtitle: "bjuder vi in till bröllop",
      greeting: "Med stor glädje önskar vi fira vår dag tillsammans med er.",
      footerText: "Varmt välkommen till vår dag",
      countdownLabel: "dagar till vår dag",
      rsvpHint: "Svara senast 10 maj",
      rsvpLabel: "OSA till bröllopet",
      mapHint: "Visa vägen",
      mapLabel: "Vägbeskrivning",
      calendarHint: "Kom ihåg dagen",
      calendarLabel: "Spara vår dag",
      phone: "0705556677",
      rsvpDate: "2027-05-10",
    },
  },
  {
    id: "nattblomma",
    name: "Nattblomma",
    category: "Bröllop",
    categorySlug: "brollop",
    price: 59,
    tagline: "En stilla kväll i midnattsblått och champagne.",
    description: "En sofistikerad bröllopsinbjudan med botaniska linjer, mjukt ljus och högtidlig typografi.",
    artwork: "/art/nattblomma-world.jpg",
    layout: "classic",
    palette: "midnight",
    recommended: ["rsvp", "map", "calendar"],
    defaultData: {
      name: "Elise & August",
      date: "2027-08-21",
      startTime: "15:30",
      endTime: "23:30",
      address: "Villa Solbacka, Vaxholm",
      kicker: "Tillsammans med våra familjer",
      subtitle: "säger vi ja",
      greeting: "Med stor glädje bjuder vi in er att fira kärleken med oss.",
      footerText: "Vi längtar efter att fira med dig",
      countdownLabel: "dagar kvar",
      rsvpHint: "Skicka ett svar",
      rsvpLabel: "OSA via SMS",
      mapHint: "Visa vägen",
      mapLabel: "Hitta hit",
      calendarHint: "Spara dagen",
      calendarLabel: "Lägg till i kalender",
      phone: "0709876543",
      rsvpDate: "2027-07-01",
    },
  },
  {
    id: "lilla-molnet",
    name: "Lilla molnet",
    category: "Dop & namngivning",
    categorySlug: "dop",
    price: 59,
    tagline: "Ljus, stillhet och mjuka himmelska toner.",
    description: "En varsam inbjudan i disigt blått med svävande moln och små handritade stjärnor.",
    artwork: "/art/lilla-molnet-world.jpg",
    layout: "classic",
    palette: "sky",
    recommended: ["rsvp", "map", "calendar"],
    defaultData: {
      name: "Noah",
      date: "2027-04-18",
      startTime: "12:00",
      endTime: "15:00",
      address: "Lidingö kyrka, Stockholm",
      kicker: "Välkommen till",
      subtitle: "namngivning",
      greeting: "Välkommen att dela en ljus och minnesvärd dag med oss.",
      footerText: "Vi ser fram emot att ses",
      countdownLabel: "dagar kvar",
      rsvpHint: "Skicka ett svar",
      rsvpLabel: "OSA via SMS",
      mapHint: "Visa vägen",
      mapLabel: "Hitta hit",
      calendarHint: "Spara dagen",
      calendarLabel: "Lägg till i kalender",
      phone: "0702468135",
      rsvpDate: "2027-04-01",
    },
  },
  {
    id: "olivkvist",
    name: "Olivkvist",
    category: "Dop & namngivning",
    categorySlug: "dop",
    price: 59,
    tagline: "Linne, olivblad och en stilla pärlemorton.",
    description: "En ljus botanisk inbjudan med varm papperskänsla och mjuka olivkvistar för dop eller namngivning.",
    artwork: "/art/olivkvist-world.png",
    layout: "classic",
    palette: "sky",
    recommended: ["rsvp", "map", "calendar"],
    defaultData: {
      name: "Lea",
      date: "2027-05-09",
      startTime: "12:30",
      endTime: "15:00",
      address: "Orangeriet, Lund",
      kicker: "Med glädje bjuder vi in till",
      subtitle: "namngivning",
      greeting: "Välkommen att dela en varm och minnesvärd stund med oss.",
      footerText: "Tack för att du delar dagen med oss",
      countdownLabel: "dagar kvar",
      rsvpHint: "Berätta om du kommer",
      rsvpLabel: "Svara på inbjudan",
      mapHint: "Visa vägen",
      mapLabel: "Visa vägen",
      calendarHint: "Kom ihåg dagen",
      calendarLabel: "Spara dagen",
      phone: "0703344556",
      rsvpDate: "2027-04-25",
    },
  },
  {
    id: "sagoskogen", name: "Sagoskogen", category: "Barnkalas", categorySlug: "barnkalas", price: 59,
    tagline: "En levande sagobok bland lyktor, rävar och mossa.",
    description: "En scrollande sagoskog i flera bildlager där kalasets information upptäcks kapitel för kapitel.",
    artwork: "/art/sagoskogen-world.webp", layout: "storybook", palette: "midnight", recommended: ["rsvp", "map", "calendar", "greeting"],
    defaultData: { name: "Milo", age: "7", date: "2027-09-04", startTime: "13:00", endTime: "16:00", address: "Skogsgläntan 8, Nacka", kicker: "Det var en gång", subtitle: "ett förtrollat 7-årskalas", greeting: "Följ lyktorna in i skogen och fira ett nytt kapitel tillsammans med oss.", footerText: "Och så började äventyret", countdownLabel: "dagar till äventyret", rsvpHint: "Svara till sagan", rsvpLabel: "OSA till kalaset", mapHint: "Följ stigen", mapLabel: "Hitta till gläntan", calendarHint: "Spara kapitlet", calendarLabel: "Spara dagen", phone: "0701203040", rsvpDate: "2027-08-22" },
  },
  {
    id: "konfettikalas", name: "Konfettikalas", category: "Barnkalas", categorySlug: "barnkalas", price: 59,
    tagline: "Stora bokstäver, klara färger och full kalasenergi.",
    description: "En grafisk affischinbjudan med djärv typografi, studsande konfetti och lekfulla färgblock.",
    artwork: "/art/konfettikalas-world.svg", layout: "poster", palette: "rose", recommended: ["rsvp", "map", "calendar", "countdown"],
    defaultData: { name: "Amina", age: "8", date: "2027-10-16", startTime: "14:00", endTime: "17:00", address: "Färgfabriken 5, Göteborg", kicker: "Hurra hurra", subtitle: "8 år med extra allt", greeting: "Kom som du är och gör dig redo för musik, tårta och konfetti!", footerText: "Mer färg. Mer skratt. Mer kalas.", countdownLabel: "dagar kvar", rsvpHint: "Är du med?", rsvpLabel: "Svara på inbjudan", mapHint: "Till festen", mapLabel: "Hitta hit", calendarHint: "Boka kalaset", calendarLabel: "Spara dagen", phone: "0702233445", rsvpDate: "2027-10-02" },
  },
  {
    id: "tidlos", name: "Tidlös", category: "Bröllop", categorySlug: "brollop", price: 59,
    tagline: "Modern typografi, oväntad balans och mycket luft.",
    description: "En asymmetrisk redaktionell bröllopsinbjudan där datum, namn och detaljer bildar en modern komposition.",
    artwork: "/art/tidlos-world.svg", layout: "editorial", palette: "sand", recommended: ["rsvp", "map", "calendar", "greeting"],
    defaultData: { name: "Signe & Otto", date: "2027-07-10", startTime: "15:00", endTime: "23:30", address: "Konsthallen, Malmö", kicker: "Tillsammans", subtitle: "bjuder vi in till vår dag", greeting: "En sommarkväll, ett löfte och alla vi tycker om på samma plats.", footerText: "Klädsel: sommarfin", countdownLabel: "dagar till vigseln", rsvpHint: "Senast 1 juni", rsvpLabel: "OSA till bröllopet", mapHint: "Platsen", mapLabel: "Vägbeskrivning", calendarHint: "Datumet", calendarLabel: "Spara vår dag", phone: "0706677889", rsvpDate: "2027-06-01" },
  },
  {
    id: "gyllene-timmen", name: "Gyllene timmen", category: "Bröllop", categorySlug: "brollop", price: 59,
    tagline: "Ett fotografiskt kärleksbrev i kvällsljus.",
    description: "Helskärmsfotografi med information som vecklar ut sig i mjuka, scrollande glaspartier.",
    artwork: "/art/gyllene-timmen-world.webp", layout: "cinematic", palette: "sand", recommended: ["rsvp", "map", "calendar", "greeting", "countdown"],
    defaultData: { name: "Mira & Elias", date: "2027-08-14", startTime: "16:00", endTime: "00:00", address: "Havsgården, Varberg", kicker: "När solen står lågt", subtitle: "säger vi ja", greeting: "Möt oss i det gyllene kvällsljuset för middag, dans och början på resten av livet.", footerText: "Vi ses där himlen möter havet", countdownLabel: "solnedgångar kvar", rsvpHint: "Svara senast 20 juni", rsvpLabel: "OSA till vår dag", mapHint: "Mot havet", mapLabel: "Hitta till gården", calendarHint: "Vår kväll", calendarLabel: "Spara datumet", phone: "0707788990", rsvpDate: "2027-06-20" },
  },
  {
    id: "manskimmer", name: "Månskimmer", category: "Dop & namngivning", categorySlug: "dop", price: 59,
    tagline: "En pärlemorskimrande natt för ett litet nytt liv.",
    description: "Illustrerad stjärnhimmel med långsamt kretsande ljuspunkter och mjuka moln.",
    artwork: "/art/manskimmer-world.webp", layout: "celestial", palette: "sky", recommended: ["rsvp", "map", "calendar", "greeting"],
    defaultData: { name: "Loui", date: "2027-11-07", startTime: "12:30", endTime: "15:30", address: "Ljuskapellet, Örebro", kicker: "Under samma måne", subtitle: "välkommen till namngivning", greeting: "Kom och fira vår lilla stjärna med en varm stund tillsammans.", footerText: "En liten stjärna, en stor dag", countdownLabel: "nätter kvar", rsvpHint: "Berätta om du kommer", rsvpLabel: "Svara på inbjudan", mapHint: "Visa vägen", mapLabel: "Hitta till kapellet", calendarHint: "Kom ihåg dagen", calendarLabel: "Spara dagen", phone: "0708899001", rsvpDate: "2027-10-20" },
  },
  {
    id: "nallekram", name: "Nallekram", category: "Babyshower", categorySlug: "babyshower", price: 59,
    tagline: "En mjuk vintagevärld för den allra första festen.",
    description: "En nostalgisk nalleillustration med handmålad blomram, band och varsam papperskänsla.",
    artwork: "/art/nallekram-world.webp", layout: "vintage", palette: "sand", recommended: ["rsvp", "map", "calendar", "greeting"],
    defaultData: { name: "Baby Lind", date: "2027-03-21", startTime: "13:00", endTime: "16:00", address: "Sjömansgatan 14, Stockholm", kicker: "En liten björnkram", subtitle: "babyshower för vår efterlängtade lilla", greeting: "Kom på fika, små överraskningar och en varm eftermiddag tillsammans.", footerText: "Små tassar lämnar stora avtryck", countdownLabel: "dagar till kramkalaset", rsvpHint: "Kan du komma?", rsvpLabel: "Svara på inbjudan", mapHint: "Till kramkalaset", mapLabel: "Hitta hit", calendarHint: "Spara stunden", calendarLabel: "Lägg till i kalender", phone: "0709900112", rsvpDate: "2027-03-08" },
  },
  {
    id: "korsbarsdrom", name: "Körsbärsdröm", category: "Babyshower", categorySlug: "babyshower", price: 59,
    tagline: "Fransk konditorikänsla med en lekfull överraskning.",
    description: "Vågiga kanter, körsbärsröda detaljer och utvikbara informationssektioner inspirerade av Paris.",
    artwork: "/art/korsbarsdrom-world.webp", layout: "patisserie", palette: "rose", recommended: ["rsvp", "map", "calendar", "greeting"],
    defaultData: { name: "Baby Moreau", date: "2027-05-02", startTime: "14:00", endTime: "17:00", address: "Lilla Patisseriet, Uppsala", kicker: "Un petit bébé", subtitle: "en söt babyshower väntar", greeting: "Macarons, körsbär och en eftermiddag för den lilla person vi längtar efter.", footerText: "Bisous från oss", countdownLabel: "dagar till fikat", rsvpHint: "Répondez s'il vous plaît", rsvpLabel: "Svara på inbjudan", mapHint: "Till bageriet", mapLabel: "Hitta hit", calendarHint: "Spara fikat", calendarLabel: "Spara dagen", phone: "0701012131", rsvpDate: "2027-04-18" },
  },
  {
    id: "guldkant", name: "Guldkant", category: "Födelsedag & jubileum", categorySlug: "fodelsedag-jubileum", price: 59,
    tagline: "Art déco, champagne och en entré med dramatik.",
    description: "En pampig jubileumsinbjudan som öppnas med dubbla geometriska paneler i svart och guld.",
    artwork: "/art/guldkant-world.svg", layout: "deco", palette: "midnight", recommended: ["rsvp", "map", "calendar", "countdown"],
    defaultData: { name: "Astrid 50", date: "2027-09-25", startTime: "18:30", endTime: "01:00", address: "Grand Hôtel, Stockholm", kicker: "En kväll med guldkant", subtitle: "middag, musik och femtio fantastiska år", greeting: "Klä upp dig, höj glaset och fira livet tillsammans med mig.", footerText: "Klädsel: festligt", countdownLabel: "dagar till galan", rsvpHint: "Reservera din plats", rsvpLabel: "OSA till festen", mapHint: "Till galan", mapLabel: "Vägbeskrivning", calendarHint: "Boka kvällen", calendarLabel: "Spara datumet", phone: "0702122232", rsvpDate: "2027-08-20" },
  },
  {
    id: "gyllene-biljetten", name: "Gyllene biljetten", category: "Student & examen", categorySlug: "student-examen", price: 59,
    tagline: "Din examen. Din biljett till nästa kapitel.",
    description: "En egen digital biljettlayout med perforering, serienummer och en festlig guldfolie-känsla.",
    artwork: "/art/gyllene-biljetten-world.svg", layout: "ticket", palette: "midnight", recommended: ["rsvp", "map", "calendar", "countdown"],
    defaultData: { name: "Nora", date: "2027-06-11", startTime: "15:00", endTime: "21:00", address: "Examensparken 3, Lund", kicker: "Gyllene biljett", subtitle: "studentmottagning 2027", greeting: "Efter sena kvällar, tidiga morgnar och många koppar kaffe är det äntligen dags att fira.", footerText: "Giltig för en oförglömlig kväll", countdownLabel: "dagar till utspring", rsvpHint: "Bekräfta plats", rsvpLabel: "OSA till mottagningen", mapHint: "Hitta till firandet", mapLabel: "Visa vägen", calendarHint: "Spara biljetten", calendarLabel: "Lägg till i kalender", phone: "0703233343", rsvpDate: "2027-05-25" },
  },
  {
    id: "citronlunden", name: "Citronlunden", category: "Fest & middag", categorySlug: "fest-middag", price: 59,
    tagline: "Ett solvarmt vykort från en kväll i södern.",
    description: "Ett interaktivt vykort som vänds från citronlundens framsida till kvällens alla detaljer.",
    artwork: "/art/citronlunden-world.webp", layout: "postcard", palette: "sky", recommended: ["rsvp", "map", "calendar", "greeting"],
    defaultData: { name: "Middag i lunden", date: "2027-07-24", startTime: "18:00", endTime: "23:00", address: "Orangeriet 7, Visby", kicker: "Saluti dalla sera", subtitle: "en lång middag under citronträden", greeting: "Ta plats vid bordet för antipasti, levande ljus och en sommarkväll som får dröja kvar.", footerText: "A presto, vi ses snart", countdownLabel: "dagar till middagen", rsvpHint: "Reservera en stol", rsvpLabel: "Svara på inbjudan", mapHint: "Till lunden", mapLabel: "Hitta till bordet", calendarHint: "Spara kvällen", calendarLabel: "Lägg till i kalender", phone: "0704344454", rsvpDate: "2027-07-10" },
  },
];

export const templateById = Object.fromEntries(templates.map((template) => [template.id, template]));

export const invitationCategories = [
  { number: "01", name: "Barnkalas", slug: "barnkalas", note: "Lekfulla världar för stora små dagar.", templateId: "sagoskogen", palette: "rose" as const },
  { number: "02", name: "Bröllop", slug: "brollop", note: "Från tidlös typografi till gyllene kvällsljus.", templateId: "tidlos", palette: "sand" as const },
  { number: "03", name: "Dop & namngivning", slug: "dop", note: "Mjuka minnen att bära med sig.", templateId: "manskimmer", palette: "sky" as const },
  { number: "04", name: "Babyshower", slug: "babyshower", note: "Varmt, lekfullt och fullt av förväntan.", templateId: "nallekram", palette: "sand" as const },
  { number: "05", name: "Födelsedag & jubileum", slug: "fodelsedag-jubileum", note: "Milstenar som förtjänar en storslagen entré.", templateId: "guldkant", palette: "midnight" as const },
  { number: "06", name: "Student & examen", slug: "student-examen", note: "Nästa kapitel börjar med en gyllene biljett.", templateId: "gyllene-biljetten", palette: "midnight" as const },
  { number: "07", name: "Fest & middag", slug: "fest-middag", note: "Långa bord, levande ljus och goda samtal.", templateId: "citronlunden", palette: "sky" as const },
] as const;

export const featureLabels: Record<FeatureKey, { title: string; description: string }> = {
  rsvp: { title: "OSA via SMS", description: "Gästen svarar med ett färdigt sms." },
  map: { title: "Hitta hit", description: "Öppnar vägbeskrivningen direkt." },
  calendar: { title: "Lägg till i kalender", description: "Sparar datum, tid och plats." },
  countdown: { title: "Nedräkning", description: "En levande nedräkning till dagen." },
  greeting: { title: "Personlig hälsning", description: "Ger inbjudan en varm, personlig ton." },
};

export const colorwayOptions: Record<InvitationTemplate["palette"], Array<{ id: Colorway; name: string; colors: [string, string, string] }>> = {
  rose: [
    { id: "signature", name: "Puderrosa", colors: ["#f3d7d5", "#bd727d", "#fff8ee"] },
    { id: "soft", name: "Salvia", colors: ["#dce2d3", "#77816c", "#fffaf0"] },
    { id: "deep", name: "Bär & guld", colors: ["#7f3648", "#d3a56f", "#f7e7dc"] },
    { id: "beige", name: "Varm beige", colors: ["#eadfce", "#927862", "#fffaf1"] },
    { id: "boy", name: "Dimmig blå", colors: ["#d5e2e5", "#5d7d89", "#f8fbf7"] },
  ],
  sand: [
    { id: "signature", name: "Sand & linne", colors: ["#eee1cf", "#8a725b", "#fffaf1"] },
    { id: "soft", name: "Salvia", colors: ["#dfe2d4", "#6f7866", "#fbf8ee"] },
    { id: "deep", name: "Terrakotta", colors: ["#8c5547", "#d7b18c", "#f8eadb"] },
    { id: "beige", name: "Ljus beige", colors: ["#eee5d7", "#8c765e", "#fffdf7"] },
    { id: "boy", name: "Havsblå", colors: ["#ccdde1", "#506f7c", "#f7faf7"] },
  ],
  midnight: [
    { id: "signature", name: "Midnattsblå", colors: ["#101b2d", "#d2b477", "#f5ead1"] },
    { id: "soft", name: "Skogsgrön", colors: ["#17342f", "#c9ae78", "#edf0df"] },
    { id: "deep", name: "Bordeaux", colors: ["#401725", "#d4aa72", "#f2dfd5"] },
    { id: "beige", name: "Linnebeige", colors: ["#e7ddcc", "#826d56", "#fff9ee"] },
    { id: "boy", name: "Dov blå", colors: ["#bfd0d7", "#425f70", "#f3f7f5"] },
  ],
  sky: [
    { id: "signature", name: "Dimblå", colors: ["#d9e7ea", "#668490", "#fffdf5"] },
    { id: "soft", name: "Salviadis", colors: ["#dbe3d7", "#768575", "#fbf8ed"] },
    { id: "deep", name: "Pärlemor", colors: ["#eadfd9", "#9b766f", "#fff9f0"] },
    { id: "beige", name: "Havre", colors: ["#e9dfcf", "#8c755f", "#fffaf1"] },
    { id: "boy", name: "Mjuk aprikos", colors: ["#f1d8c8", "#9a6f60", "#fff8ef"] },
  ],
};
