"use client";

import type { PartyPokemon } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/i18n/provider";
import {
  getDexNumber,
  getInitials,
  getPokemonDisplayName,
  getPokemonSpeciesName,
  getPokemonSpriteUrl,
  getPokemonTypes,
} from "@/lib/pokemon";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

type PartySlotProps = {
  displaySlot: number;
  pokemon?: PartyPokemon;
  selected: boolean;
  onSelect: () => void;
};

export function PartySlot({ displaySlot, pokemon, selected, onSelect }: PartySlotProps) {
  const { t } = useLanguage();

  if (!pokemon) {
    return (
      <div className="grid min-h-[86px] grid-cols-[44px_1fr] gap-3 rounded-md border border-dashed border-[#3f503f]/60 bg-[#111511]/45 p-3 opacity-80">
        <div className="grid h-11 w-11 place-items-center rounded-md border border-[#3f503f] bg-[#1b211b] font-mono text-xs text-[#8c9a86]">
          {displaySlot}
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">
            {t("party.emptySlot")}
          </p>
          <p className="mt-1 text-sm font-bold text-[#c1b59a]">{t("party.noSyncedPokemon")}</p>
        </div>
      </div>
    );
  }

  const types = getPokemonTypes(pokemon);
  const spriteUrl = getPokemonSpriteUrl(pokemon);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "focus-ring grid min-h-[86px] w-full grid-cols-[44px_1fr] gap-3 rounded-md border p-3 text-left transition",
        selected
          ? "border-[#ffe09a] bg-[#302b1c] shadow-[inset_4px_0_0_#f0bf54,inset_0_0_0_2px_rgba(240,191,84,0.24),0_0_0_1px_rgba(240,191,84,0.18)]"
          : "border-[#3f503f]/70 bg-[#111511]/85 hover:border-[#67d8cf]/70 hover:bg-[#1b211b]",
      )}
    >
      <div
        className={cn(
          "grid h-11 w-11 place-items-center rounded-md border font-mono text-sm font-black",
          selected
            ? "border-[#ffe09a] bg-[#f0bf54] text-[#10130f]"
            : "border-[#3f503f] bg-[#263126] text-[#67d8cf]",
        )}
      >
        {spriteUrl ? (
          <img
            src={spriteUrl}
            alt=""
            className="pixel-art h-10 w-10 object-contain"
          />
        ) : (
          getInitials(pokemon.species)
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-base font-black text-[#fff5de]">{getPokemonDisplayName(pokemon)}</p>
            <p className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-[0.1em] text-[#8c9a86]">
              {getDexNumber(pokemon)} / {getPokemonSpeciesName(pokemon)}
            </p>
          </div>
          <span className="shrink-0 rounded-md border border-[#3f503f] bg-[#263126] px-2 py-1 font-mono text-[11px] text-[#fff5de]">
            Lv {pokemon.level ?? "?"}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {types.length > 0 ? (
            types.map((type) => <TypeBadge key={type} type={type} compact />)
          ) : (
            <TypeBadge type="unknown" compact />
          )}
        </div>
      </div>
    </button>
  );
}
