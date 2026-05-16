"use client";

import { OAuthLoginButton, useOAuthLogin } from "@features/oauth-login";
import { fadeRise } from "@shared/lib/animations";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useSyncExternalStore } from "react";
import { useKakaoProfile } from "../lib/useKakaoProfile";
import { useSignupFormDefaults } from "../lib/useSignupFormDefaults";
import { EnneagramHero } from "./EnneagramHero";
import { SignupFallback } from "./SignupFallback";
import { SignupForm } from "./SignupForm";

const ENNEAGRAM_STORAGE_KEY = "oauth:enneagram-type";
const emptySubscribe = () => () => {};

function useResolvedEnneagramType() {
  const searchParams = useSearchParams();
  const paramType = searchParams?.get("enneagram-type") ?? null;
  const storedType = useSyncExternalStore(
    emptySubscribe,
    () =>
      paramType ? null : localStorage.getItem(ENNEAGRAM_STORAGE_KEY) ?? null,
    () => null,
  );
  return paramType || storedType || undefined;
}

interface SignupContentProps {
  isAuthenticated: boolean;
}

function SignupContent({ isAuthenticated }: SignupContentProps) {
  const { login: oauthLogin } = useOAuthLogin();
  const {
    userName: kakaoUserName,
    avatarUrl: kakaoAvatarUrl,
    isLoaded,
  } = useKakaoProfile(isAuthenticated);
  const { formKey, formDefaultUserName } = useSignupFormDefaults(
    isAuthenticated,
    isLoaded,
    kakaoUserName,
  );
  const enneagramType = useResolvedEnneagramType();
  const hasPresetType = !!enneagramType;

  if (!isAuthenticated) {
    return (
      <UnauthenticatedSignup
        enneagramType={enneagramType}
        onLogin={() => {
          if (enneagramType) {
            localStorage.setItem(ENNEAGRAM_STORAGE_KEY, enneagramType);
          }
          oauthLogin("kakao");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-fafafa flex flex-col items-center justify-center px-4 py-12">
      {hasPresetType && <EnneagramHero typeValue={enneagramType} />}
      <motion.div
        {...fadeRise(hasPresetType ? 0.15 : 0)}
        className="w-full max-w-[360px] bg-white border border-gray-200 rounded-lg p-8 mb-4"
      >
        {!hasPresetType && <SignupBrandHeader />}
        <p className="text-sm text-gray-700 text-center bg-gray-50 rounded-md py-3 px-3 mb-6">
          {hasPresetType
            ? "아래 정보만 입력하면 가입이 완료됩니다."
            : "한 단계만 남았어요. 아래 항목을 입력하면 가입이 완료됩니다."}
        </p>
        <SignupForm
          kakaoAvatarUrl={kakaoAvatarUrl}
          key={formKey}
          formDefaultUserName={formDefaultUserName}
          fromKakao={true}
          defaultEnneagramType={enneagramType}
        />
      </motion.div>
    </div>
  );
}

function SignupBrandHeader() {
  return (
    <>
      <h1 className="text-2xl font-bold italic font-serif tracking-tight text-center text-gray-900">
        OQ1
      </h1>
      <p className="text-center text-sm font-medium text-gray-600 mt-1">
        오늘 큐티 완료
      </p>
      <p className="text-center text-xs text-gray-500 mt-2 mb-6">
        매일 QT를 나누고 사람을 연결하는 플랫폼
      </p>
    </>
  );
}

interface UnauthenticatedSignupProps {
  enneagramType: string | undefined;
  onLogin: () => void;
}

function UnauthenticatedSignup({
  enneagramType,
  onLogin,
}: UnauthenticatedSignupProps) {
  const hasPresetType = !!enneagramType;
  return (
    <div className="min-h-screen bg-fafafa flex flex-col items-center justify-center px-4 py-12">
      {hasPresetType && <EnneagramHero typeValue={enneagramType} />}
      <motion.div
        {...fadeRise(hasPresetType ? 0.15 : 0)}
        className="w-full max-w-[360px] bg-white border border-gray-200 rounded-lg p-8 mb-4"
      >
        <h1 className="text-2xl font-bold italic font-serif tracking-tight text-center text-gray-900">
          OQ1
        </h1>
        <p className="text-center text-sm font-medium text-gray-600 mt-1">
          오늘 큐티 완료
        </p>
        <p className="text-center text-xs text-gray-500 mt-2 mb-8">
          회원가입을 위해 먼저 카카오 로그인이 필요합니다.
        </p>
        <OAuthLoginButton
          provider="kakao"
          onClick={onLogin}
          variant="signup"
        />
        <p className="text-center text-xs text-gray-500 mt-4">
          카카오 계정 하나로 로그인·가입됩니다.
        </p>
      </motion.div>
    </div>
  );
}

interface SignupClientContentProps {
  isAuthenticated: boolean;
}

export default function SignupClientContent({
  isAuthenticated,
}: SignupClientContentProps) {
  return (
    <Suspense fallback={<SignupFallback />}>
      <SignupContent isAuthenticated={isAuthenticated} />
    </Suspense>
  );
}
