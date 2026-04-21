"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLanguage, LanguageProvider } from "@/lib/i18n/provider";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AppShellContent>{children}</AppShellContent>
    </LanguageProvider>
  );
}

function AppShellContent({ children }: { children: ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <header className="border-b border-[#4d5736]/70 bg-[#15180f]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/servers" className="focus-ring flex items-center gap-3 rounded-sm">
            <span className="grid h-9 w-9 place-items-center border border-[#d7ae45]/50 bg-[#252a1d] font-mono text-sm text-[#d7ae45]">
              CT
            </span>
            <span>
              <span className="block text-lg font-black uppercase tracking-[0.08em] text-[#f4ead2]">
                {t("layout.brandTitle")}
              </span>
              <span className="block text-xs uppercase tracking-[0.16em] text-[#b7a98b]">
                {t("layout.brandSubtitle")}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <nav aria-label={t("layout.mainNavigation")} className="flex items-center gap-2">
            <Link
              href="/servers"
              className="focus-ring border border-[#4d5736] bg-[#1d2117] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#f4ead2] hover:border-[#d7ae45]/70"
            >
              {t("layout.servers")}
            </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
