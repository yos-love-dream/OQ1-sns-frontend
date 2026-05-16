import { getNow, parseDate, sanitizeText, subtractYears } from "@shared/lib/utils";
import { z } from "zod";

const MIN_AGE = 18;
const MAX_NAME_LENGTH = 10;
const GUK_NO_MIN = 1;
const GUK_NO_MAX = 5;

export const profileSchema = z.object({
  user_name: z
    .string()
    .min(1, "이름을 입력해 주세요.")
    .transform((s: string) => sanitizeText(s))
    .refine((s) => /^[가-힣\s]+$/.test(s), "이름은 한글만 입력할 수 있습니다.")
    .refine(
      (s) => s.length <= MAX_NAME_LENGTH,
      `이름은 ${MAX_NAME_LENGTH}자 이내로 입력해 주세요.`,
    ),
  guk_no: z.coerce
    .number()
    .int("소속국은 정수로 입력해 주세요.")
    .min(GUK_NO_MIN, `소속국은 ${GUK_NO_MIN}~${GUK_NO_MAX} 사이로 입력해 주세요.`)
    .max(GUK_NO_MAX, `소속국은 ${GUK_NO_MIN}~${GUK_NO_MAX} 사이로 입력해 주세요.`),
  birth_date: z
    .string()
    .min(1, "생년월일을 선택해 주세요.")
    .refine((val) => {
      const birth = parseDate(val);
      const cutoff = subtractYears(getNow(), MIN_AGE);
      return birth <= cutoff;
    }, "청년들만 가입할 수 있습니다."),
  enneagram_type: z
    .string({ required_error: "에니어그램 유형을 선택해 주세요." })
    .min(1, "에니어그램 유형을 선택해 주세요.")
    .refine((v: string) => /^[1-9]w[1-9]$/.test(v), {
      message: "에니어그램 유형을 선택해 주세요.",
    }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
