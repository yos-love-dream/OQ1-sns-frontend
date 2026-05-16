import { z } from "zod";

const DailyQtJoinSchema = z.object({
  id: z.string(),
  qt_date: z.string(),
  bible_book: z.string(),
  chapter: z.number(),
  verse_from: z.number(),
  verse_to: z.number(),
  content: z.string().nullable().optional(),
});

export const EditingPostRowSchema = z.object({
  meditation: z.string(),
  is_public: z.boolean(),
  daily_qt: DailyQtJoinSchema,
});
