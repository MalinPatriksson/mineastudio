import { z } from "zod";

export const invitationDataSchema = z.object({
  name: z.string().trim().min(1).max(32),
  photoUrl: z.string().optional(),
  coverImageUrl: z.string().max(180).optional(),
  photoPositionX: z.number().min(0).max(100).optional(),
  photoPositionY: z.number().min(0).max(100).optional(),
  photoShape: z.enum(["organic", "arch", "circle"]).optional(),
  photoFrame: z.enum(["clean", "fade", "floral"]).optional(),
  age: z.string().max(3).optional(),
  date: z.iso.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.union([z.string().regex(/^\d{2}:\d{2}$/), z.literal("")]).optional(),
  address: z.string().trim().min(2).max(180),
  kicker: z.string().max(48),
  subtitle: z.string().max(48),
  greeting: z.string().max(150),
  footerText: z.string().max(120),
  countdownLabel: z.string().max(80),
  rsvpHint: z.string().max(80),
  rsvpLabel: z.string().max(80),
  mapHint: z.string().max(80),
  mapLabel: z.string().max(80),
  calendarHint: z.string().max(80),
  calendarLabel: z.string().max(80),
  phone: z.string().trim().min(5).max(30),
  rsvpDate: z.union([z.iso.date(), z.literal("")]),
});

export const invitationConfigurationSchema = z.object({
  data: invitationDataSchema,
  enabled: z.array(z.enum(["rsvp", "map", "calendar", "countdown", "greeting"])).max(5),
  animation: z.enum(["none", "soft", "playful"]),
  colorway: z.enum(["signature", "soft", "deep", "beige", "boy"]),
  rsvpMode: z.enum(["form", "sms", "none"]),
  rsvpQuestions: z.object({ partySize: z.boolean(), allergies: z.boolean(), message: z.boolean() }),
});

export const invitationValidationMessage = (field?: string) => field === "email"
  ? "Kontrollera att mejladressen är korrekt."
  : "Kontrollera datum, tider och obligatoriska uppgifter i inbjudan.";
