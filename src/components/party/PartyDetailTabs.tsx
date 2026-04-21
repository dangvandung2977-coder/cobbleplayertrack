"use client";

import { useState } from "react";
import type { ApiPlayer, PartyPokemon } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/i18n/provider";
import { PokemonMovesPanel } from "@/components/pokemon/PokemonMovesPanel";
import { PokemonStatsPanel } from "@/components/pokemon/PokemonStatsPanel";
import { PokemonSummaryPanel } from "@/components/pokemon/PokemonSummaryPanel";

type DetailTab = "summary" | "moves" | "stats";

type PartyDetailTabsProps = {
  pokemon?: PartyPokemon;
  player: ApiPlayer;
};

export function PartyDetailTabs({ pokemon, player }: PartyDetailTabsProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<DetailTab>("summary");
  const tabs: Array<{ id: DetailTab; label: string }> = [
    { id: "summary", label: t("party.detailTabs.summary") },
    { id: "moves", label: t("party.detailTabs.moves") },
    { id: "stats", label: t("party.detailTabs.stats") },
  ];
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? tabs[0].label;

  return (
    <section className="game-panel rounded-sm p-4">
      <div className="mb-4 flex flex-col gap-3 border-b border-[#4d5736]/70 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">
            {t("party.detailEyebrow")}
          </p>
          <h2 className="mt-1 text-2xl font-black text-[#f4ead2]">
            {t("party.detailHeading", { tab: activeTabLabel })}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("party.detailScreen")}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={cn(
                "focus-ring border px-4 py-2 text-sm font-black uppercase tracking-[0.1em] transition",
                activeTab === tab.id
                  ? "border-[#d7ae45] bg-[#d7ae45] text-[#15180f]"
                  : "border-[#4d5736] bg-[#15180f] text-[#f4ead2] hover:border-[#d7ae45]/70",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-[fadeIn_160ms_ease-out] transition-opacity duration-200 ease-out">
        {activeTab === "summary" ? <PokemonSummaryPanel pokemon={pokemon} player={player} /> : null}
        {activeTab === "moves" ? <PokemonMovesPanel pokemon={pokemon} /> : null}
        {activeTab === "stats" ? <PokemonStatsPanel pokemon={pokemon} /> : null}
      </div>
    </section>
  );
}
