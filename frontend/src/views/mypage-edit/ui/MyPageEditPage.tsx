import { EDIT_PROFILE_FORM_ID, EditContent } from "@features/edit-profile";
import { MobileHeader } from "@widgets/mobile-header";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface MyPageEditPageProps {
  userId: string;
}

export function MyPageEditPage({ userId }: MyPageEditPageProps) {
  return (
    <div className="pb-20 md:py-8">
      <MobileHeader
        showLogo={false}
        leftContent={
          <Link
            href="/mypage"
            className="flex items-center gap-0.5 text-gray-700 hover:opacity-70 -ml-1"
            aria-label="뒤로"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </Link>
        }
        rightContent={
          <button
            type="submit"
            form={EDIT_PROFILE_FORM_ID}
            className="text-sm font-semibold text-blue-500 hover:opacity-70"
          >
            완료
          </button>
        }
      />
      <EditContent userId={userId} />
    </div>
  );
}
