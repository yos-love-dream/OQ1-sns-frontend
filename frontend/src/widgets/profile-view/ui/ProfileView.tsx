"use client";

import { useUserProfile } from "@entities/user";
import { AsyncBoundary } from "@shared/ui/async-boundary";
import { type ReactNode } from "react";
import { ProfileBody } from "./ProfileBody";
import { ProfileSkeleton } from "./ProfileSkeleton";

interface ProfileViewProps {
  userId: string;
  isOwnProfile?: boolean;
  initialProfile?: Parameters<typeof useUserProfile>[1];
  children?: ReactNode;
}

export default function ProfileView({
  userId,
  isOwnProfile = false,
  initialProfile,
  children,
}: ProfileViewProps) {
  return (
    <AsyncBoundary pendingFallback={<ProfileSkeleton />}>
      <ProfileBody
        userId={userId}
        isOwnProfile={isOwnProfile}
        initialProfile={initialProfile}
      >
        {children}
      </ProfileBody>
    </AsyncBoundary>
  );
}
