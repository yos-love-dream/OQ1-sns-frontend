import { z } from "zod";

export const DailyQtSchema = z.object({
  id: z.string(),
  qt_date: z.string(),
  bible_book: z.string(),
  chapter: z.number(),
  verse_from: z.number(),
  verse_to: z.number(),
  content: z.string().optional().nullable().transform((v) => v ?? undefined),
});
