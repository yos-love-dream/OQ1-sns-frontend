import { profileSchema } from "@entities/user";
import { z } from "zod";

export const signupSchema = profileSchema.extend({
  agree_terms: z.literal(true, {
    errorMap: () => ({
      message: "이용약관 및 개인정보 처리방침에 동의해 주세요.",
    }),
  }),
});

export type SignupFormData = z.infer<typeof signupSchema>;
