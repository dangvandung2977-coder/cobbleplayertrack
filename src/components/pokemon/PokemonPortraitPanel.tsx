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

type PokemonPortraitPanelProps = {
  pokemon?: PartyPokemon;
};

export function PokemonPortraitPanel({ pokemon }: PokemonPortraitPanelProps) {
  const { t } = useLanguage();
  const spriteUrl = getPokemonSpriteUrl(pokemon);
  const types = getPokemonTypes(pokemon);

  return (
    <aside className="game-panel rounded-sm p-4">
      <div className="mb-4 border-b border-[#4d5736]/70 pb-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">
          {t("pokemon.selected")}
        </p>
        <h2 className="mt-1 truncate text-2xl font-black text-[#f4ead2]">
          {getPokemonDisplayName(pokemon)}
        </h2>
      </div>

      <div className="game-panel-strong grid aspect-[4/5] place-items-center overflow-hidden rounded-sm p-4">
        {pokemon && spriteUrl ? (
          <img
            src={spriteUrl}
            alt={`${getPokemonDisplayName(pokemon)} sprite`}
            className="h-64 w-64 object-contain [image-rendering:pixelated] sm:h-72 sm:w-72 lg:h-80 lg:w-80"
          />
        ) : (
          <div className="grid h-64 w-64 place-items-center border-2 border-[#d7ae45]/55 bg-[#15180f]/70 shadow-[inset_0_0_0_8px_rgba(215,174,69,0.08)] sm:h-72 sm:w-72 lg:h-80 lg:w-80">
            <span className="font-mono text-6xl font-black text-[#d7ae45]">
              {pokemon ? getInitials(pokemon.species) : "?"}
            </span>
          </div>
        )}
      </div>

      <dl className="mt-4 grid gap-3 text-sm">
        <QuickInfo label={t("pokemon.dexNo")} value={getDexNumber(pokemon)} />
        <QuickInfo label={t("pokemon.species")} value={getPokemonSpeciesName(pokemon)} />
        <QuickInfo
          label={t("pokemon.level")}
          value={pokemon ? `Lv ${pokemon.level ?? "?"}` : t("common.unknown")}
        />
        <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
            {t("pokemon.type")}
          </dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {types.length > 0 ? (
              types.map((type) => <TypeBadge key={type} type={type} />)
            ) : (
              <TypeBadge type="unknown" />
            )}
          </dd>
        </div>
        <QuickInfo
          label={t("pokemon.hp")}
          value={
            pokemon?.hpCurrent !== undefined && pokemon?.hpMax
              ? `${pokemon.hpCurrent}/${pokemon.hpMax}`
              : t("common.unknown")
          }
          strong={pokemon?.hpCurrent !== undefined && Boolean(pokemon?.hpMax)}
        />
      </dl>
    </aside>
  );
}

function QuickInfo({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">{label}</dt>
      <dd className={cn("mt-1 text-[#f4ead2]", strong ? "text-lg font-black" : "font-bold")}>
        {value}
      </dd>
    </div>
  );
}
