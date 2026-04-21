"use client";

import { useMemo, useState } from "react";
import type { PartyPokemon, StatSpread } from "@/lib/api/types";
import { useLanguage } from "@/lib/i18n/provider";
import {
  getStatTotal,
  getStatValue,
  hasAnyStats,
  STAT_KEYS,
  STAT_LABELS,
  type StatKey,
} from "@/lib/pokemon";
import { StatRadarChart } from "@/components/pokemon/StatRadarChart";
import { StatSubTabs, type StatMode } from "@/components/pokemon/StatSubTabs";

type PokemonStatsPanelProps = {
  pokemon?: PartyPokemon;
};

export function PokemonStatsPanel({ pokemon }: PokemonStatsPanelProps) {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<StatMode>("stats");
  const statData = useMemo(() => getModeSpread(pokemon, activeMode), [pokemon, activeMode]);
  const maxValue = getModeMax(activeMode, statData);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border border-[#4d5736]/70 bg-[#15180f]/85 p-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
            {t("pokemon.statLens")}
          </p>
          <p className="mt-1 font-bold text-[#f4ead2]">
            {pokemon ? t("pokemon.statLensDescription") : t("pokemon.noPokemonSelectedTitle")}
          </p>
        </div>
        <StatSubTabs activeMode={activeMode} onModeChange={setActiveMode} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <StatRadarChart values={statData} maxValue={maxValue} />
        {activeMode === "other" ? (
          <OtherStats pokemon={pokemon} />
        ) : (
          <StatRows values={statData} mode={activeMode} maxValue={maxValue} />
        )}
      </div>
    </div>
  );
}

function getModeSpread(pokemon: PartyPokemon | undefined, mode: StatMode): StatSpread | null | undefined {
  if (!pokemon) {
    return null;
  }

  if (mode === "ivs") {
    return pokemon.ivs;
  }

  if (mode === "evs") {
    return pokemon.evs;
  }

  return pokemon.stats;
}

function getModeMax(mode: StatMode, values: StatSpread | null | undefined) {
  if (mode === "ivs") {
    return 31;
  }

  if (mode === "evs") {
    return 252;
  }

  const highest = Math.max(...STAT_KEYS.map((key) => getStatValue(values, key) ?? 0));
  return Math.max(100, highest);
}

function StatRows({
  values,
  mode,
  maxValue,
}: {
  values: StatSpread | null | undefined;
  mode: StatMode;
  maxValue: number;
}) {
  const { t } = useLanguage();
  const anyStats = hasAnyStats(values);
  const summaryLabel = getStatSummaryLabel(mode, t);
  const summaryValue = getStatSummaryValue(values, mode);

  return (
    <div className="space-y-3">
      {STAT_KEYS.map((key) => {
        const value = getStatValue(values, key);
        const percent = value === null ? 0 : Math.max(0, Math.min(100, (value / maxValue) * 100));
        return (
          <div
            key={key}
            className="grid gap-3 border border-[#4d5736]/70 bg-[#15180f]/85 p-3 md:grid-cols-[84px_1fr_56px] md:items-center"
          >
            <p className="font-black text-[#f4ead2]">{STAT_LABELS[key as StatKey]}</p>
            <div className="h-4 border border-[#4d5736] bg-[#252a1d]">
              <div className="h-full bg-[#59c7d4]" style={{ width: `${percent}%` }} />
            </div>
            <p className="font-mono text-lg font-black text-[#d7ae45]">{value ?? "--"}</p>
          </div>
        );
      })}

      <div className="border border-[#4d5736]/70 bg-[#252a1d] p-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">{summaryLabel}</p>
        <p className="mt-1 text-2xl font-black text-[#f4ead2]">
          {anyStats ? summaryValue : t("common.unknown")}
        </p>
      </div>
    </div>
  );
}

function getKnownStatValues(spread: StatSpread | null | undefined) {
  return STAT_KEYS.map((key) => getStatValue(spread, key)).filter((value): value is number => value !== null);
}

function getStatAverage(spread: StatSpread | null | undefined) {
  const values = getKnownStatValues(spread);
  if (values.length === 0) {
    return null;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function formatAverage(value: number | null) {
  if (value === null) {
    return "Unknown";
  }

  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

function getStatSummaryLabel(mode: StatMode, t: (key: string) => string) {
  if (mode === "stats") {
    return t("pokemon.trackedStatTotal");
  }

  if (mode === "ivs") {
    return t("pokemon.ivAverage");
  }

  return t("pokemon.evTotal");
}

function getStatSummaryValue(values: StatSpread | null | undefined, mode: StatMode) {
  if (mode === "ivs") {
    return `${formatAverage(getStatAverage(values))}/31`;
  }

  return getStatTotal(values);
}

function OtherStats({ pokemon }: { pokemon?: PartyPokemon }) {
  const { t } = useLanguage();
  const hpKnown = pokemon?.hpCurrent !== undefined || pokemon?.hpMax !== undefined;
  const displaySlot =
    pokemon && pokemon.slot >= 0 && pokemon.slot < 6
      ? pokemon.slot + 1
      : pokemon?.slot ?? t("common.unknown");

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <OtherBox
        label={t("pokemon.currentHp")}
        value={hpKnown ? `${pokemon?.hpCurrent ?? "?"}/${pokemon?.hpMax ?? "?"}` : t("common.unknown")}
      />
      <OtherBox label={t("pokemon.partySlot")} value={`${displaySlot}`} />
      <OtherBox label={t("pokemon.shiny")} value={pokemon?.shiny ? t("common.yes") : t("common.no")} />
      <OtherBox
        label={t("pokemon.knownMoves")}
        value={pokemon ? `${pokemon.moves?.length ?? 0}/4` : t("common.unknown")}
      />
      <OtherBox
        label={t("pokemon.statsTotal")}
        value={hasAnyStats(pokemon?.stats) ? `${getStatTotal(pokemon?.stats)}` : t("common.unknown")}
      />
      <OtherBox
        label={t("pokemon.ivAverage")}
        value={hasAnyStats(pokemon?.ivs) ? `${formatAverage(getStatAverage(pokemon?.ivs))}/31` : t("common.unknown")}
      />
    </div>
  );
}

function OtherBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#4d5736]/70 bg-[#15180f]/85 p-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">{label}</p>
      <p className="mt-1 text-lg font-black text-[#f4ead2]">{value}</p>
    </div>
  );
}
