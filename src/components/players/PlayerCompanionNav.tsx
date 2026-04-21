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
    <section className="game-panel rounded-sm p-2">
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
                "focus-ring grid grid-cols-[40px_1fr] gap-3 border px-4 py-3 transition duration-150 ease-out",
                active
                  ? "border-[#d7ae45] bg-[#2f2816] shadow-[inset_0_0_0_1px_rgba(215,174,69,0.28)]"
                  : "border-[#4d5736]/70 bg-[#15180f]/65 hover:border-[#d7ae45]/70 hover:bg-[#1b1f16]",
              )}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center border font-mono text-sm font-black",
                  active
                    ? "border-[#f1ce73] bg-[#d7ae45] text-[#15180f]"
                    : "border-[#4d5736] bg-[#252a1d] text-[#d7ae45]",
                )}
              >
                {`0${index + 1}`}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black text-[#f4ead2]">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm text-[#b7a98b]">
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
