import type { PokedexEntry } from "@/lib/api/types";
import pokedexData from "@/data/pokedex.json";

export type StaticPokedexEntry = {
  species: string;
  name: string;
  dexNumber: number | null;
  iconPath: string | null;
  types: string[];
};

export type PokedexDisplayEntry = StaticPokedexEntry & {
  unlocked: boolean;
  caught: boolean;
  seen: boolean;
};

const STATIC_POKEDEX = pokedexData as StaticPokedexEntry[];

export function normalizeSpeciesKey(value: string | null | undefined) {
  return (value ?? "")
    .split(":")
    .at(-1)
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "") ?? "";
}

export function getFullPokedex() {
  return STATIC_POKEDEX;
}

export function buildPokedexDisplayEntries(entries: PokedexEntry[] | null | undefined): PokedexDisplayEntry[] {
  const backendEntries = new Map<string, PokedexEntry>();

  for (const entry of entries ?? []) {
    backendEntries.set(normalizeSpeciesKey(entry.species), entry);
  }

  return STATIC_POKEDEX.map((entry) => {
    const backendEntry = backendEntries.get(normalizeSpeciesKey(entry.species));
    const seen = Boolean(backendEntry?.seen ?? backendEntry?.unlocked ?? backendEntry?.caught);
    const caught = Boolean(backendEntry?.caught);
    const unlocked = Boolean(backendEntry?.unlocked ?? caught ?? seen);

    return {
      ...entry,
      dexNumber: backendEntry?.dexNumber ?? entry.dexNumber,
      unlocked,
      caught,
      seen,
    };
  });
}

export function formatDexNumber(value: number | null | undefined) {
  return value ? `#${value.toString().padStart(4, "0")}` : "#????";
}
