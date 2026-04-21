"use client";

import type { PartyPokemon } from "@/lib/api/types";
import { useLanguage } from "@/lib/i18n/provider";
import { PartySlot } from "@/components/pokemon/PartySlot";

type PartyPanelProps = {
  party: PartyPokemon[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
};

export function PartyPanel({ party, selectedIndex, onSelectIndex }: PartyPanelProps) {
  const { t } = useLanguage();
  const slots = Array.from({ length: 6 }, (_, index) => party[index]);

  return (
    <aside className="game-panel rounded-sm p-4">
      <div className="mb-4 border-b border-[#4d5736]/70 pb-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">
          {t("nav.party")}
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#f4ead2]">
          {t("party.currentTeam")}
        </h2>
      </div>

      <div className="space-y-3">
        {slots.map((pokemon, index) => (
          <PartySlot
            key={pokemon ? `${pokemon.slot}-${pokemon.species}-${index}` : `empty-${index}`}
            displaySlot={index + 1}
            pokemon={pokemon}
            selected={Boolean(pokemon) && selectedIndex === index}
            onSelect={() => onSelectIndex(index)}
          />
        ))}
      </div>
    </aside>
  );
}
