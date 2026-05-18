"use client";

import { MobileHeader } from "@widgets/mobile-header";
import { ProfileView } from "@widgets/profile-view";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileDetailPageProps {
  targetUserId: string;
  currentUserId: string | null;
}

export function ProfileDetailPage({
  targetUserId,
  currentUserId,
}: ProfileDetailPageProps) {
  const router = useRouter();

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
