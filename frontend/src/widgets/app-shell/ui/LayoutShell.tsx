'use client';

import { usePathname } from 'next/navigation';
import { BottomNav, Sidebar } from './Navigation';

const MINIMAL_LAYOUT_PATHS = ['/login', '/signup', '/privacy', '/terms'];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimal = MINIMAL_LAYOUT_PATHS.some((p) => pathname?.startsWith(p));

  if (isMinimal) {
    return <div className="min-h-screen bg-fafafa text-gray-900">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-fafafa text-gray-900 pb-16 md:pb-0 md:pl-64">
      <Sidebar />
      <main className="max-w-2xl mx-auto min-h-screen md:py-8">{children}</main>
      <BottomNav />
    </div>
  );
}
