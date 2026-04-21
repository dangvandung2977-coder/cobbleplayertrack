"use client";

import { useLanguage } from "@/lib/i18n/provider";
import { PokedexEntryCard } from "@/components/pokedex/PokedexEntryCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PokedexDisplayEntry } from "@/lib/pokedex";

type PokedexGridProps = {
  entries: PokedexDisplayEntry[];
  selectedSpecies: string | null;
  onSelectSpecies: (species: string) => void;
};

export function PokedexGrid({ entries, selectedSpecies, onSelectSpecies }: PokedexGridProps) {
  const { t } = useLanguage();

  if (entries.length === 0) {
    return (
      <EmptyState
        title={t("empty.noEntriesTitle")}
        message={t("empty.noEntriesMessage")}
      />
    );
  }

  return (
    <div className="grid max-h-[620px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
      {entries.map((entry) => (
        <PokedexEntryCard
          key={entry.species}
          entry={entry}
          selected={selectedSpecies === entry.species}
          onSelect={() => onSelectSpecies(entry.species)}
        />
      ))}
    </div>
  );
}
