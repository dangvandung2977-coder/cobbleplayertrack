"use client";

import type { PartyPokemon, PokedexEntry } from "@/lib/api/types";
import { useLanguage } from "@/lib/i18n/provider";
import { PokedexPanel } from "@/components/pokedex/PokedexPanel";
import { SectionPanel } from "@/components/ui/SectionPanel";

type PokedexPageShellProps = {
  entries: PokedexEntry[] | null;
  party: PartyPokemon[];
  errorMessage?: string | null;
};

export function PokedexPageShell({
  entries,
  party,
  errorMessage,
}: PokedexPageShellProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <SectionPanel
        eyebrow={t("pokedex.fieldEncyclopedia")}
        title={t("pokedex.trainerPokedex")}
        description={t("pokedex.trainerPokedexDescription")}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <InfoChip label={t("pokedex.displayMode")} value={t("pokedex.displayModeValue")} />
          <InfoChip label={t("pokedex.selection")} value={t("pokedex.selectionValue")} />
          <InfoChip label={t("pokedex.fallback")} value={t("pokedex.fallbackValue")} />
        </div>
      </SectionPanel>

      <PokedexPanel entries={entries} party={party} errorMessage={errorMessage} />
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#83785f]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[#f4ead2]">{value}</p>
    </div>
  );
}
