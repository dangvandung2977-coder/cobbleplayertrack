"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  buildPlayerCompanionHref,
  type PlayerCompanionPage,
} from "@/lib/api/player-companion";
import { useLanguage } from "@/lib/i18n/provider";

type PlayerCompanionNavProps = {
  playerUuid: string;
  activePage: PlayerCompanionPage;
};

export function PlayerCompanionNav({
  playerUuid,
  activePage,
}: PlayerCompanionNavProps) {
  const { t } = useLanguage();
  const navItems: Array<{
    id: PlayerCompanionPage;
    label: string;
    description: string;
  }> = [
    {
      id: "party",
      label: t("nav.party"),
      description: t("nav.partyDescription"),
    },
    {
      id: "pokedex",
      label: t("nav.pokedex"),
      description: t("nav.pokedexDescription"),
    },
    {
      id: "team-analyze",
      label: t("nav.teamAnalyze"),
      description: t("nav.teamAnalyzeDescription"),
    },
  ];

  return (
    <section className="game-panel p-2">
      <nav
        aria-label={`${t("player.trainerFile")} companion pages`}
        className="grid gap-2 md:grid-cols-3"
      >
        {navItems.map((item, index) => {
          const active = item.id === activePage;
          return (
            <Link
              key={item.id}
              href={buildPlayerCompanionHref(item.id, playerUuid)}
              className={cn(
                "focus-ring grid grid-cols-[40px_1fr] gap-3 rounded-md border px-4 py-3 transition duration-150 ease-out",
                active
                  ? "border-[#f0bf54] bg-[#2d2a1b] shadow-[inset_0_0_0_1px_rgba(240,191,84,0.28)]"
                  : "border-[#3f503f]/70 bg-[#111511]/65 hover:border-[#67d8cf]/70 hover:bg-[#1b211b]",
              )}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-md border font-mono text-sm font-black",
                  active
                    ? "border-[#ffe09a] bg-[#f0bf54] text-[#10130f]"
                    : "border-[#3f503f] bg-[#263126] text-[#67d8cf]",
                )}
              >
                {`0${index + 1}`}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black text-[#fff5de]">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm leading-5 text-[#c1b59a]">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
