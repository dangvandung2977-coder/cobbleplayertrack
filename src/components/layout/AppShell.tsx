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
    <div className="shell-frame min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#3f503f]/70 bg-[#10130f]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/servers" className="focus-ring flex min-w-0 items-center gap-3 rounded-md">
            <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md border border-[#f0bf54]/45 bg-[#263126] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
              <img
                src="/assets/cobblemon/pokemon-icons/regular/0025_pikachu.png"
                alt=""
                className="pixel-art h-10 w-10 object-contain"
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-black uppercase tracking-[0.08em] text-[#fff5de]">
                {t("layout.brandTitle")}
              </span>
              <span className="block truncate text-xs uppercase tracking-[0.16em] text-[#c1b59a]">
                {t("layout.brandSubtitle")}
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="hidden items-center gap-2 rounded-md border border-[#3f503f]/80 bg-[#171b15]/90 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#7ed36f] sm:flex">
              <span className="status-dot" />
              Live Tracker
            </span>
            <nav aria-label={t("layout.mainNavigation")} className="flex items-center gap-2">
              <Link
                href="/servers"
                className="focus-ring rounded-md border border-[#3f503f] bg-[#1b211b] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#fff5de] transition hover:border-[#f0bf54]/70 hover:bg-[#263126]"
              >
                {t("layout.servers")}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
    </div>
  );
}
