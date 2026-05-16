"use client";

import { useAlert } from "@shared/lib/alert";
import { UserAvatar } from "@entities/user";
import { getDailyInsight } from "@entities/daily-word";
import { fadeRise } from "@shared/lib/animations";
import { isFeatureEnabled, sanitizeText } from "@shared/lib/utils";
import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Image as ImageIcon, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  Suspense,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPost, State } from "../api/actions";
import { useDailyQt } from "../lib/useDailyQt";
import { useRewardConfetti } from "../lib/useRewardConfetti";
import type { DailyQt } from "@entities/daily-word";
import { AmbientParticles } from "./AmbientParticles";
import { RewardOverlay } from "./RewardOverlay";
import { ScriptureQuote } from "./ScriptureQuote";
import { UploadFormSkeleton } from "./UploadFormSkeleton";

const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 2200;
const MAX_TAG_LENGTH = 20;

const initialFormState: State = { message: undefined, errors: {} };

interface EditingPost {
  meditation: string;
  is_public: boolean;
}

interface UploadFormBodyProps {
  userName: string;
  avatarUrl: string | null;
  dailyQt: DailyQt | null;
  editingPost: EditingPost | null;
  editPostId: string | null;
}

function UploadFormBody({
  userName,
  avatarUrl,
  dailyQt,
  editingPost,
  editPostId,
}: UploadFormBodyProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const showAlert = useAlert();

  const [state, formAction, isPending] = useActionState(
    createPost,
    initialFormState,
  );

  const [content, setContent] = useState(editingPost?.meditation ?? "");
  const [isAnonymous, setIsAnonymous] = useState(
    editingPost ? !editingPost.is_public : false,
  );
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useRewardConfetti(showReward);

  useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      const timer = setTimeout(() => setShowReward(true), 0);
      return () => clearTimeout(timer);
    } else if (state.message) {
      showAlert(state.message);
    }
  }, [state, showAlert, queryClient]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key !== "Enter" || !tagInput.trim()) return;
    e.preventDefault();

    const cleanTag = sanitizeText(tagInput);
    if (cleanTag.length > MAX_TAG_LENGTH) {
      showAlert(
        `태그를 조금만 더 줄여볼까요? ${MAX_TAG_LENGTH}자 이내면 딱 좋아요! 😊`,
      );
    } else if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleGenerateInsight = async () => {
    const scripture = dailyQt?.content;
    if (!scripture) {
      showAlert(
        "오늘의 말씀을 아직 불러오지 못했어요. 잠시만 기다려 주시겠어요? 🌿",
      );
      return;
    }
    setIsGeneratingInsight(true);
    const insight = await getDailyInsight(scripture);
    setContent((prev) => [prev, `Q. ${insight}`].filter(Boolean).join("\n\n"));
    setIsGeneratingInsight(false);
  };

  const canSubmit =
    content.length >= MIN_CONTENT_LENGTH && !!dailyQt && !isPending;

  return (
    <form
      action={formAction}
      className="bg-white min-h-screen pb-20 md:pb-8 relative"
    >
      <input type="hidden" name="postId" value={editPostId || ""} />
      <input type="hidden" name="qtId" value={dailyQt?.id || ""} />
      <input type="hidden" name="isAnonymous" value={String(isAnonymous)} />
      <input type="hidden" name="tags" value={JSON.stringify(tags)} />

      <AmbientParticles />
      {showReward && <RewardOverlay onClose={() => router.push("/")} />}

      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-base font-normal text-gray-900 hover:opacity-70"
        >
          취소
        </button>
        <h1 className="text-base font-bold text-gray-900">
          {editPostId ? "큐티 수정하기" : "큐티 작성하기"}
        </h1>
        <button
          type="submit"
          disabled={!canSubmit}
          className={`text-base font-bold transition-colors ${
            canSubmit
              ? "text-blue-500 hover:text-blue-700 cursor-pointer"
              : "text-blue-200 cursor-default"
          }`}
        >
          {isPending ? "처리 중..." : "저장"}
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        {dailyQt && <ScriptureQuote dailyQt={dailyQt} />}

        <motion.div
          {...fadeRise(0.15)}
          className="flex p-4 gap-4 border-b border-gray-100"
        >
          <div className="shrink-0 pt-1">
            {image ? (
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded overflow-hidden border border-gray-200">
                <Image
                  src={image}
                  alt="Selected"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-0.5 right-0.5 bg-black/60 text-white p-0.5 rounded-full hover:bg-black/80"
                >
                  <X size={10} />
                </button>
              </div>
            ) : (
              <UserAvatar
                src={avatarUrl ?? undefined}
                alt={userName}
                size="md"
              />
            )}
          </div>

          <div className="flex-1">
            <Textarea
              name="content"
              className="w-full h-32 md:h-40 p-0 text-base placeholder:text-gray-400 border-none resize-none leading-relaxed bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none focus-visible:outline-none"
              placeholder={`오늘의 말씀을 통해 주신 귀한 묵상을 ${MIN_CONTENT_LENGTH}자 이상 나눠주세요... 🌿`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={MAX_CONTENT_LENGTH}
            />
            {state.errors?.content && (
              <p className="text-red-500 text-xs mt-1">
                {state.errors.content[0]}
              </p>
            )}

            <div className="flex justify-end mt-2">
              <button
                onClick={handleGenerateInsight}
                disabled={isGeneratingInsight}
                className="text-xs font-semibold text-purple-600 flex items-center gap-1 bg-purple-50 px-2.5 py-1.5 rounded-md hover:bg-purple-100 transition-colors"
                type="button"
              >
                <Sparkles
                  size={12}
                  className={isGeneratingInsight ? "animate-spin" : undefined}
                />
                AI 묵상 질문
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeRise(0.3)}
          className="divide-y divide-gray-100 border-b border-gray-100"
        >
          {isFeatureEnabled("photoUpload") && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-between py-3.5 px-4 cursor-pointer active:bg-gray-50 transition-colors"
            >
              <span className="text-base text-gray-900">사진 추가</span>
              <div className="flex items-center gap-2">
                {image && (
                  <span className="text-xs text-blue-500 font-medium">
                    1장 선택됨
                  </span>
                )}
                <ImageIcon size={20} className="text-gray-400" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                name="image"
              />
            </div>
          )}

          {isFeatureEnabled("tags") && (
            <div className="py-3.5 px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-gray-900">태그</span>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-[70%]">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded font-medium flex items-center gap-1 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        #{tag} <X size={8} />
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Input
                type="text"
                placeholder="태그 입력... (Enter)"
                className="w-full text-sm bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 shadow-none h-auto"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                onKeyPress={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between py-3.5 px-4">
            <div className="flex flex-col">
              <span className="text-base text-gray-900">나만 보기</span>
              <span className="text-xs text-gray-400 mt-0.5">
                피드에 공개되지 않습니다.
              </span>
            </div>
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-11 h-6 rounded-full transition-colors relative ${isAnonymous ? "bg-black" : "bg-gray-200"}`}
              type="button"
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${isAnonymous ? "left-5.5" : "left-0.5"}`}
              />
            </button>
          </div>
        </motion.div>
      </div>
    </form>
  );
}

interface UploadFormProps {
  userName: string;
  avatarUrl: string | null;
}

function UploadForm({ userName, avatarUrl }: UploadFormProps) {
  const searchParams = useSearchParams();
  const editPostId = searchParams?.get("id") ?? null;
  const { dailyQt, editingPost, isLoading } = useDailyQt(editPostId);

  if (isLoading) return <UploadFormSkeleton />;

  return (
    <UploadFormBody
      userName={userName}
      avatarUrl={avatarUrl}
      dailyQt={dailyQt}
      editingPost={editingPost}
      editPostId={editPostId}
    />
  );
}

interface UploadContentProps {
  userName: string;
  avatarUrl: string | null;
}

export default function UploadContent({
  userName,
  avatarUrl,
}: UploadContentProps) {
  return (
    <Suspense fallback={<UploadFormSkeleton />}>
      <UploadForm userName={userName} avatarUrl={avatarUrl} />
    </Suspense>
  );
}
