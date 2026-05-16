"use client";

import { useAlert } from "@app/providers/AlertProvider";
import { UserAvatar } from "@entities/user";
import { DatePicker } from "@shared/ui/date-picker";
import { Input } from "@shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { ENNEAGRAM_OPTIONS, INPUT_ERROR_CLASS } from "@shared/lib/constants";
import { cn } from "@shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { signupSchema, type SignupFormData } from "../lib/schema";
import { useSignupSubmit } from "../lib/useSignupSubmit";
import { EnneagramPreviewConnected } from "./EnneagramPreview";

const SIGNUP_FORM_ID = "signup-form";
const USER_NAME_MAX_LENGTH = 10;
const GUK_NO_MIN = 1;
const GUK_NO_MAX = 5;

function scrollToFirstError(fieldErrors: Record<string, unknown>) {
  const firstErrorKey = Object.keys(fieldErrors)[0];
  if (!firstErrorKey) return;
  const formEl = document.getElementById(SIGNUP_FORM_ID);
  const targetEl = formEl?.querySelector<HTMLElement>(
    `[name="${firstErrorKey}"], #${firstErrorKey}`,
  );
  targetEl?.scrollIntoView?.({ behavior: "smooth", block: "center" });
}

interface SignupFormProps {
  formDefaultUserName: string;
  fromKakao: boolean;
  defaultEnneagramType?: string;
  kakaoAvatarUrl?: string | null;
}

export function SignupForm({
  formDefaultUserName,
  fromKakao,
  defaultEnneagramType,
  kakaoAvatarUrl,
}: SignupFormProps) {
  const showAlert = useAlert();
  const submitSignup = useSignupSubmit(fromKakao);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zodResolver Zod version compatibility
    resolver: zodResolver(signupSchema as any),
    defaultValues: {
      user_name: formDefaultUserName,
      guk_no: undefined,
      birth_date: "",
      enneagram_type: defaultEnneagramType,
      agree_terms: undefined,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await submitSignup(data);
    } catch (e) {
      console.error("Signup submit error:", e);
      showAlert("가입 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <form
      id={SIGNUP_FORM_ID}
      onSubmit={handleSubmit(onSubmit, scrollToFirstError)}
      className="space-y-4"
    >
      {!defaultEnneagramType && <EnneagramPreviewConnected control={control} />}

      <div>
        <label
          htmlFor="user_name"
          className="block text-xs font-medium text-gray-600 mb-1"
        >
          이름 *
        </label>
        <div className="flex items-center gap-2">
          {kakaoAvatarUrl && (
            <UserAvatar src={kakaoAvatarUrl} alt="나" size="sm" />
          )}
          <Input
            id="user_name"
            type="text"
            placeholder={`이름을 입력하세요 (한글 ${USER_NAME_MAX_LENGTH}자 이내)`}
            maxLength={USER_NAME_MAX_LENGTH}
            className={cn(errors.user_name && INPUT_ERROR_CLASS)}
            {...register("user_name")}
          />
        </div>
        {errors.user_name && (
          <p className="mt-1 text-xs text-red-600">
            {errors.user_name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="guk_no"
          className="block text-xs font-medium text-gray-600 mb-1"
        >
          청년부 소속국(n국) *
        </label>
        <div className="relative">
          <Input
            id="guk_no"
            type="number"
            placeholder="숫자로 입력"
            min={GUK_NO_MIN}
            max={GUK_NO_MAX}
            className={cn("pr-9", errors.guk_no && INPUT_ERROR_CLASS)}
            {...register("guk_no")}
          />
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            aria-hidden
          >
            국
          </span>
        </div>
        {errors.guk_no && (
          <p className="mt-1 text-xs text-red-600">{errors.guk_no.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="birth_date"
          className="block text-xs font-medium text-gray-600 mb-1"
        >
          생년월일 *
        </label>
        <Controller
          name="birth_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder="생년월일 선택"
              error={!!errors.birth_date}
            />
          )}
        />
        {errors.birth_date && (
          <p className="mt-1 text-xs text-red-600">
            {errors.birth_date.message}
          </p>
        )}
      </div>

      {!defaultEnneagramType && (
        <div>
          <label
            htmlFor="enneagram_type"
            className="block text-xs font-medium text-gray-600 mb-1"
          >
            에니어그램 유형 *
          </label>
          <Controller
            name="enneagram_type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="enneagram_type"
                  className={cn(errors.enneagram_type && INPUT_ERROR_CLASS)}
                >
                  <SelectValue placeholder="에니어그램 유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  {ENNEAGRAM_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      textValue={opt.label}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.enneagram_type && (
            <p className="mt-1 text-xs text-red-600">
              {errors.enneagram_type.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            className={cn(
              "mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-gray-900 cursor-pointer",
              errors.agree_terms && "border-red-300",
            )}
            {...register("agree_terms")}
          />
          <span className="text-xs text-gray-600 leading-relaxed">
            <Link
              href="/terms"
              target="_blank"
              className="underline hover:text-gray-900"
            >
              이용약관
            </Link>
            {" 및 "}
            <Link
              href="/privacy"
              target="_blank"
              className="underline hover:text-gray-900"
            >
              개인정보 처리방침
            </Link>
            에 동의합니다.
          </span>
        </label>
        {errors.agree_terms && (
          <p className="mt-1 text-xs text-red-600">
            {errors.agree_terms.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 text-sm font-semibold text-white bg-black rounded-md hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
      >
        {isSubmitting ? "가입 중..." : "가입하기"}
      </button>
    </form>
  );
}
