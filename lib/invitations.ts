export type AnimationStyle = "none" | "soft" | "playful";
export type Colorway = "signature" | "soft" | "deep" | "beige" | "boy";
export type FeatureKey = "rsvp" | "map" | "calendar" | "countdown" | "greeting";
export type PhotoShape = "organic" | "arch" | "circle";
export type PhotoFrameStyle = "clean" | "fade" | "floral";

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
    price: 39,
    tagline: "Rosetter, blommor och en liten värld av magi.",
    description: "En handmålad kalasdröm i puderrosa, med mjuka rosetter och lekfulla detaljer som vaknar till liv.",
    artwork: "/art/rosendrom-world.jpg",
    palette: "rose",
    recommended: ["rsvp", "map", "calendar", "countdown", "greeting"],
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
    price: 39,
    tagline: "Ett soligt trädgårdskalas i aprikos och salvia.",
    description: "En varm, handmålad kalasvärld med äppelblom, vimplar och en liten picknick under träden.",
    artwork: "/art/appelblom-world.png",
    palette: "rose",
    recommended: ["rsvp", "map", "calendar", "countdown", "greeting"],
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
    price: 49,
    tagline: "Varm minimalism i linne, sand och champagne.",
    description: "En mjuk och professionell bröllopsinbjudan med taktil papperskänsla, luft och diskreta botaniska detaljer.",
    artwork: "/art/sandlofte-world.png",
    palette: "sand",
    recommended: ["rsvp", "map", "calendar", "greeting"],
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
    price: 49,
    tagline: "En stilla kväll i midnattsblått och champagne.",
    description: "En sofistikerad bröllopsinbjudan med botaniska linjer, mjukt ljus och högtidlig typografi.",
    artwork: "/art/nattblomma-world.jpg",
    palette: "midnight",
    recommended: ["rsvp", "map", "calendar", "greeting"],
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
    price: 39,
    tagline: "Ljus, stillhet och mjuka himmelska toner.",
    description: "En varsam inbjudan i disigt blått med svävande moln och små handritade stjärnor.",
    artwork: "/art/lilla-molnet-world.jpg",
    palette: "sky",
    recommended: ["rsvp", "map", "calendar", "greeting"],
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
    price: 39,
    tagline: "Linne, olivblad och en stilla pärlemorton.",
    description: "En ljus botanisk inbjudan med varm papperskänsla och mjuka olivkvistar för dop eller namngivning.",
    artwork: "/art/olivkvist-world.png",
    palette: "sky",
    recommended: ["rsvp", "map", "calendar", "greeting"],
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
];

export const templateById = Object.fromEntries(templates.map((template) => [template.id, template]));

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
    { id: "boy", name: "Pojkblå", colors: ["#c9dce3", "#4f7180", "#f6faf9"] },
  ],
};
