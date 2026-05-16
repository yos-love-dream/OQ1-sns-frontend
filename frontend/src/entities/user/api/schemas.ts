import { z } from "zod";

export const OqUserRowSchema = z.object({
  id: z.string(),
  user_name: z.string(),
  guk_no: z.number(),
  birth_date: z.string().nullable(),
  enneagram_type: z.string().nullable(),
  avatar_url: z.string().nullable(),
  deleted_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const ProfileRowSchema = z.object({
  user_name: z.string().nullable(),
  guk_no: z.number().nullable(),
  birth_date: z.string().nullable(),
  enneagram_type: z.string().nullable(),
  avatar_url: z.string().nullable(),
});
