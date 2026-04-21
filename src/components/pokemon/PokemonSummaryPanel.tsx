"use client";

import type { ApiPlayer, PartyPokemon } from "@/lib/api/types";
import { useLanguage } from "@/lib/i18n/provider";
import {
  formatPokemonValue,
  getDexNumber,
  getPokemonDisplayName,
  getPokemonSpeciesName,
  getPokemonTypes,
} from "@/lib/pokemon";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

type PokemonSummaryPanelProps = {
  pokemon?: PartyPokemon;
  player: ApiPlayer;
};

export function PokemonSummaryPanel({ pokemon, player }: PokemonSummaryPanelProps) {
  const { t } = useLanguage();

  if (!pokemon) {
    return (
      <EmptyDetail
        title={t("pokemon.noPokemonSelectedTitle")}
        message={t("pokemon.noPokemonSelectedMessage")}
      />
    );
  }

  const types = getPokemonTypes(pokemon);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <SummaryRow label={t("pokemon.dexNo")} value={getDexNumber(pokemon)} />
      <SummaryRow label={t("pokemon.species")} value={getPokemonSpeciesName(pokemon)} />
      <SummaryRow label={t("pokemon.nickname")} value={pokemon.nickname || t("common.none")} />
      <SummaryRow label={t("pokemon.level")} value={`Lv ${pokemon.level ?? "?"}`} />
      <SummaryRow label={t("pokemon.gender")} value={formatPokemonValue(pokemon.gender)} />
      <div className="border border-[#4d5736]/70 bg-[#15180f]/85 p-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
          {t("pokemon.type")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {types.length > 0 ? (
            types.map((type) => <TypeBadge key={type} type={type} />)
          ) : (
            <TypeBadge type="unknown" />
          )}
        </div>
      </div>
      <SummaryRow label={t("pokemon.ot")} value={player.name} />
      <SummaryRow label={t("pokemon.nature")} value={formatPokemonValue(pokemon.nature)} />
      <SummaryRow label={t("pokemon.ability")} value={formatPokemonValue(pokemon.ability)} />
      <SummaryRow label={t("pokemon.heldItem")} value={formatPokemonValue(pokemon.heldItem)} />
      <SummaryRow label={t("pokemon.form")} value={formatPokemonValue(pokemon.form)} />
      <SummaryRow
        label={t("pokemon.shiny")}
        value={pokemon.shiny ? t("common.yes") : t("common.no")}
        highlight={pokemon.shiny}
      />
      <SummaryRow label={t("pokemon.displayName")} value={getPokemonDisplayName(pokemon)} wide />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
  wide = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={
        wide
          ? "border border-[#4d5736]/70 bg-[#15180f]/85 p-3 md:col-span-2"
          : "border border-[#4d5736]/70 bg-[#15180f]/85 p-3"
      }
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">{label}</p>
      <p className={highlight ? "mt-1 font-black text-[#d7ae45]" : "mt-1 font-bold text-[#f4ead2]"}>
        {value}
      </p>
    </div>
  );
}

function EmptyDetail({ title, message }: { title: string; message: string }) {
  return (
    <div className="border border-dashed border-[#4d5736] bg-[#15180f]/70 p-8 text-center">
      <h3 className="text-xl font-black text-[#f4ead2]">{title}</h3>
      <p className="mt-2 text-sm text-[#b7a98b]">{message}</p>
    </div>
  );
}
