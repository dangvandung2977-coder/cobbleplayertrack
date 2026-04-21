"use client";

import type { PartyPokemon } from "@/lib/api/types";
import {
  getPokemonDisplayName,
  getPokemonSpeciesName,
  getPokemonTypes,
} from "@/lib/pokemon";
import { useLanguage } from "@/lib/i18n/provider";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { SectionPanel } from "@/components/ui/SectionPanel";

type PartyHeaderProps = {
  partySize: number;
  selectedPokemon?: PartyPokemon;
};

export function PartyHeader({ partySize, selectedPokemon }: PartyHeaderProps) {
  const { t } = useLanguage();
  const types = getPokemonTypes(selectedPokemon);
  const displaySlot =
    selectedPokemon && selectedPokemon.slot >= 1 && selectedPokemon.slot <= 6
      ? selectedPokemon.slot
      : selectedPokemon
        ? selectedPokemon.slot + 1
        : null;

  return (
    <SectionPanel
      eyebrow={t("party.originalLayoutEyebrow")}
      title={t("party.originalLayoutTitle")}
      description={t("party.originalLayoutDescription")}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
            {t("party.activeMember")}
          </p>
          <h2 className="mt-1 text-3xl font-black text-[#f4ead2]">
            {selectedPokemon
              ? getPokemonDisplayName(selectedPokemon)
              : t("party.noPokemonSelected")}
          </h2>
          <p className="mt-2 text-sm text-[#b7a98b]">
            {selectedPokemon
              ? `${getPokemonSpeciesName(selectedPokemon)} · ${t("common.slot", { slot: displaySlot ?? "?" })} · Lv ${selectedPokemon.level ?? "?"}`
              : t("pokemon.noPokemonSelectedMessage")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="border border-[#4d5736] bg-[#15180f] px-4 py-2 text-sm font-black text-[#f4ead2]">
            {t("common.syncedSlots", { count: partySize })}
          </span>
          {types.length > 0
            ? types.map((type) => <TypeBadge key={type} type={type} compact />)
            : <TypeBadge type="unknown" compact />}
        </div>
      </div>
    </SectionPanel>
  );
}
