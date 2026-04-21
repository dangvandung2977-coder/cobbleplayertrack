"use client";

import { useMemo, useState } from "react";
import type { ApiPlayer, PartyPokemon, PokedexEntry } from "@/lib/api/types";
import { PartyPanel } from "@/components/pokemon/PartyPanel";
import { PokemonDetailTabs } from "@/components/pokemon/PokemonDetailTabs";
import { PokemonPortraitPanel } from "@/components/pokemon/PokemonPortraitPanel";
import { EmptyState } from "@/components/ui/EmptyState";

type PlayerPokemonScreenProps = {
  player: ApiPlayer;
  party: PartyPokemon[];
  pokedexEntries: PokedexEntry[] | null;
  pokedexError: string | null;
};

export function PlayerPokemonScreen({ player, party, pokedexEntries, pokedexError }: PlayerPokemonScreenProps) {
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
      <div className="grid gap-6 lg:grid-cols-[280px_1fr_360px]">
        <PokemonPortraitPanel />
        <section className="game-panel rounded-sm p-4">
          <EmptyState
            title="No party synced"
            message="This player profile exists, but no party snapshot has reached the dashboard yet."
          />
        </section>
        <PartyPanel party={[]} selectedIndex={0} onSelectIndex={() => undefined} />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
      <PokemonPortraitPanel pokemon={selectedPokemon} />
      <PokemonDetailTabs
        pokemon={selectedPokemon}
        player={player}
        party={sortedParty}
        pokedexEntries={pokedexEntries}
        pokedexError={pokedexError}
      />
      <PartyPanel party={sortedParty} selectedIndex={effectiveIndex} onSelectIndex={setSelectedIndex} />
    </div>
  );
}
