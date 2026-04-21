"use client";

import type { PartyPokemon } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import {
  getDexNumber,
  getInitials,
  getPokemonDisplayName,
  getPokemonSpeciesName,
  getPokemonSpriteUrl,
  getPokemonTypes,
} from "@/lib/pokemon";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

type PartyMemberCardProps = {
  displaySlot: number;
  pokemon?: PartyPokemon;
  selected: boolean;
  onSelect: () => void;
};

export function PartyMemberCard({
  displaySlot,
  pokemon,
  selected,
  onSelect,
}: PartyMemberCardProps) {
  if (!pokemon) {
    return (
      <div className="grid min-h-[96px] grid-cols-[52px_1fr] gap-3 border border-dashed border-[#4d5736]/60 bg-[#15180f]/45 p-3 opacity-70">
      <div className="grid h-[52px] w-[52px] place-items-center border border-[#4d5736] bg-[#1d2117] font-mono text-xs text-[#83785f]">
          {displaySlot}
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
            Empty slot
          </p>
          <p className="mt-1 text-base font-bold text-[#b7a98b]">
            No synced Pokemon
          </p>
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
        "focus-ring grid min-h-[96px] w-full grid-cols-[52px_1fr] gap-3 border p-3 text-left transition duration-150 ease-out",
        selected
          ? "border-[#f1ce73] bg-[#3a321d] shadow-[inset_4px_0_0_#d7ae45,inset_0_0_0_1px_rgba(215,174,69,0.34),0_0_0_1px_rgba(215,174,69,0.16)]"
          : "border-[#4d5736]/70 bg-[#15180f]/82 hover:border-[#d7ae45]/70 hover:bg-[#1b1f16]",
      )}
    >
      <div
        className={cn(
          "grid h-[52px] w-[52px] place-items-center border font-mono text-sm font-black",
          selected
            ? "border-[#f1ce73] bg-[#d7ae45] text-[#15180f]"
            : "border-[#4d5736] bg-[#252a1d] text-[#d7ae45]",
        )}
      >
        {spriteUrl ? (
          <img
            src={spriteUrl}
            alt=""
            className="h-11 w-11 object-contain [image-rendering:pixelated]"
          />
        ) : (
          getInitials(pokemon.species)
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-base font-black text-[#f4ead2]">
              {getPokemonDisplayName(pokemon)}
            </p>
            <p className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-[0.1em] text-[#83785f]">
              {getDexNumber(pokemon)} / {getPokemonSpeciesName(pokemon)}
            </p>
          </div>
          <span className="shrink-0 border border-[#4d5736] bg-[#252a1d] px-2 py-1 font-mono text-[11px] text-[#f4ead2]">
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
