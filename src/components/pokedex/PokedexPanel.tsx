"use client";

import { useMemo, useState } from "react";
import type { PartyPokemon, PokedexEntry } from "@/lib/api/types";
import { useLanguage } from "@/lib/i18n/provider";
import { buildPokedexDisplayEntries, normalizeSpeciesKey } from "@/lib/pokedex";
import { cn } from "@/lib/cn";
import { ErrorState } from "@/components/ui/ErrorState";
import { PokedexDetailPanel } from "@/components/pokedex/PokedexDetailPanel";
import { PokedexGrid } from "@/components/pokedex/PokedexGrid";
import { PokedexSearchBar } from "@/components/pokedex/PokedexSearchBar";

type PokedexPanelProps = {
  entries: PokedexEntry[] | null;
  party: PartyPokemon[];
  errorMessage?: string | null;
};

type PokedexFilter = "all" | "unlocked" | "caught" | "locked";

export function PokedexPanel({ entries, party, errorMessage }: PokedexPanelProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PokedexFilter>("all");
  const effectiveEntries = useMemo(() => mergePartyFallbackEntries(entries, party), [entries, party]);
  const displayEntries = useMemo(() => buildPokedexDisplayEntries(effectiveEntries), [effectiveEntries]);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const totalUnlocked = displayEntries.filter((entry) => entry.unlocked).length;
  const totalCaught = displayEntries.filter((entry) => entry.caught).length;
  const filters: Array<{ id: PokedexFilter; label: string }> = [
    { id: "all", label: t("pokedex.filters.all") },
    { id: "unlocked", label: t("pokedex.filters.unlocked") },
    { id: "caught", label: t("pokedex.filters.caught") },
    { id: "locked", label: t("pokedex.filters.locked") },
  ];

  const filteredEntries = useMemo(() => {
    const normalizedQuery = normalizeSpeciesKey(query);

    return displayEntries.filter((entry) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unlocked" && entry.unlocked) ||
        (filter === "caught" && entry.caught) ||
        (filter === "locked" && !entry.unlocked);
      const matchesQuery =
        !normalizedQuery ||
        normalizeSpeciesKey(entry.name).includes(normalizedQuery) ||
        normalizeSpeciesKey(entry.species).includes(normalizedQuery) ||
        entry.dexNumber?.toString().padStart(4, "0").includes(normalizedQuery) ||
        entry.dexNumber?.toString().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [displayEntries, filter, query]);

  const effectiveSelectedSpecies =
    selectedSpecies && filteredEntries.some((entry) => entry.species === selectedSpecies)
      ? selectedSpecies
      : (filteredEntries.find((entry) => entry.unlocked)?.species ?? filteredEntries[0]?.species ?? null);
  const selectedEntry = displayEntries.find((entry) => entry.species === effectiveSelectedSpecies);

  if (errorMessage) {
    return (
      <ErrorState
        titleKey="states.pokedexSyncUnavailable"
        messageKey="states.trainerProfileStillAvailable"
        messageValues={{ error: errorMessage }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border border-[#4d5736]/70 bg-[#15180f]/85 p-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
            {t("pokedex.sync")}
          </p>
          <p className="mt-1 font-bold text-[#f4ead2]">
            {t("pokedex.syncCounts", {
              caught: totalCaught,
              unlocked: totalUnlocked,
              indexed: displayEntries.length,
            })}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <PokedexSearchBar value={query} onChange={setQuery} />
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={t("pokedex.filterAria")}>
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  "focus-ring border px-3 py-2 font-mono text-[11px] font-black uppercase tracking-[0.12em] transition",
                  filter === item.id
                    ? "border-[#d7ae45] bg-[#d7ae45] text-[#15180f]"
                    : "border-[#4d5736] bg-[#10130d] text-[#f4ead2] hover:border-[#d7ae45]/70",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <PokedexGrid
          entries={filteredEntries}
          selectedSpecies={effectiveSelectedSpecies}
          onSelectSpecies={setSelectedSpecies}
        />
        <PokedexDetailPanel
          entry={selectedEntry}
          totalUnlocked={totalUnlocked}
          totalCaught={totalCaught}
          totalEntries={displayEntries.length}
        />
      </div>
    </div>
  );
}

function mergePartyFallbackEntries(entries: PokedexEntry[] | null, party: PartyPokemon[]): PokedexEntry[] {
  const merged = new Map<string, PokedexEntry>();

  for (const entry of entries ?? []) {
    merged.set(normalizeSpeciesKey(entry.species), entry);
  }

  for (const pokemon of party) {
    const key = normalizeSpeciesKey(pokemon.species);
    if (!key) {
      continue;
    }

    const existing = merged.get(key);
    merged.set(key, {
      species: pokemon.species,
      dexNumber: existing?.dexNumber ?? pokemon.dexNumber,
      unlocked: true,
      caught: true,
      seen: true,
    });
  }

  return Array.from(merged.values());
}
