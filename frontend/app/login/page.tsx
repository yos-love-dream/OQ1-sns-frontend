import { redirectIfAuthenticated } from "@shared/api/supabase/auth";
import type { Metadata } from "next";
import { LoginContent as LoginPageContent } from "@views/login";

export const metadata: Metadata = {
  title: "로그인",
  description: "카카오 또는 Apple 계정으로 OQ1에 로그인하세요.",
};

export default async function LoginPage() {
  await redirectIfAuthenticated();
  return <LoginPageContent />;
}
