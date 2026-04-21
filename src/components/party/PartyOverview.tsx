"use client";

import { useMemo, useState } from "react";
import type { ApiPlayer, PartyPokemon } from "@/lib/api/types";
import { useLanguage } from "@/lib/i18n/provider";
import { PartyDetailTabs } from "@/components/party/PartyDetailTabs";
import { PartyHeader } from "@/components/party/PartyHeader";
import { PartyPanel } from "@/components/pokemon/PartyPanel";
import { PokemonPortraitPanel } from "@/components/pokemon/PokemonPortraitPanel";
import { EmptyState } from "@/components/ui/EmptyState";

type PartyOverviewProps = {
  player: ApiPlayer;
  party: PartyPokemon[];
};

export function PartyOverview({ player, party }: PartyOverviewProps) {
  const { t } = useLanguage();
  const sortedParty = useMemo(
    () =>
      [...party]
        .filter(Boolean)
        .sort((first, second) => first.slot - second.slot)
        .slice(0, 6),
    [party],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedPokemon = sortedParty[selectedIndex] ?? sortedParty[0];
  const effectiveIndex = sortedParty[selectedIndex] ? selectedIndex : 0;

  if (sortedParty.length === 0) {
    return (
      <div className="space-y-6">
        <PartyHeader partySize={0} />
        <div className="grid gap-6 2xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          <PokemonPortraitPanel />
          <section className="game-panel rounded-sm p-4">
            <div className="mb-4 border-b border-[#4d5736]/70 pb-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">
                {t("party.detailEyebrow")}
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#f4ead2]">
                {t("party.detailHeading", { tab: t("party.detailTabs.summary") })}
              </h2>
            </div>
            <EmptyState
              title={t("party.noPartySnapshot")}
              message={t("party.noPartyMembersMessage")}
            />
          </section>
          <PartyPanel party={[]} selectedIndex={0} onSelectIndex={() => undefined} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PartyHeader partySize={sortedParty.length} selectedPokemon={selectedPokemon} />

      <div className="grid gap-6 2xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <PokemonPortraitPanel pokemon={selectedPokemon} />
        <PartyDetailTabs pokemon={selectedPokemon} player={player} />
        <PartyPanel
          party={sortedParty}
          selectedIndex={effectiveIndex}
          onSelectIndex={setSelectedIndex}
        />
      </div>
    </div>
  );
}
