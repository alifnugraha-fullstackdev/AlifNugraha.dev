"use client";

import { usePathname } from "next/navigation";

export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}

export function AdminAwareWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <div className={isAdmin ? "*:min-h-screen" : "pt-[64px] *:min-h-[calc(100dvh-115px)]"}>
      {children}
    </div>
  );
}
