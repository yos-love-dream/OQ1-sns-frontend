"use client";

import { getCurrentUser } from "@shared/api/supabase/auth-client";
import { MobileHeader } from "@widgets/mobile-header";
import { ProfileView } from "@widgets/profile-view";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const targetUserId = (params?.id ?? "") as string;

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) return;
      setCurrentUserId(user.id);
      if (user.id === targetUserId) {
        router.replace("/mypage");
      }
    };
    checkUser();
  }, [targetUserId, router]);

  return (
    <div className="pb-20 md:py-8">
      <MobileHeader
        leftContent={
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft size={24} strokeWidth={1.5} className="text-gray-700" />
          </button>
        }
      />

      <div className="mt-2 md:mt-0">
        <ProfileView
          userId={targetUserId}
          isOwnProfile={currentUserId === targetUserId}
        />
      </div>
    </div>
  );
}
