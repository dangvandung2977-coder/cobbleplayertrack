"use client";

import { useLanguage } from "@/lib/i18n/provider";
import { formatDexNumber, type PokedexDisplayEntry } from "@/lib/pokedex";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

type PokedexDetailPanelProps = {
  entry?: PokedexDisplayEntry;
  totalUnlocked: number;
  totalCaught: number;
  totalEntries: number;
};

export function PokedexDetailPanel({
  entry,
  totalUnlocked,
  totalCaught,
  totalEntries,
}: PokedexDetailPanelProps) {
  const { t } = useLanguage();

  if (!entry) {
    return (
      <aside className="border border-[#4d5736]/70 bg-[#15180f]/85 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">
          {t("pokedex.entryDetail")}
        </p>
        <div className="mt-5 border border-dashed border-[#4d5736] bg-[#10130d] p-8 text-center text-[#83785f]">
          {t("pokedex.selectEntry")}
        </div>
      </aside>
    );
  }

  const statusValue = entry.caught
    ? t("pokedex.caughtLabel")
    : entry.seen
      ? t("pokedex.seen")
      : t("pokedex.unlocked");

  return (
    <aside className="border border-[#4d5736]/70 bg-[#15180f]/85 p-5">
      <div className="flex items-start justify-between gap-3 border-b border-[#4d5736]/70 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">
            {t("pokedex.entryDetail")}
          </p>
          <h3 className="mt-1 text-2xl font-black text-[#f4ead2]">
            {entry.unlocked ? entry.name : t("pokedex.unknownSpecies")}
          </h3>
        </div>
        <span className="border border-[#d7ae45]/70 bg-[#2a2516] px-3 py-2 font-mono text-sm font-black text-[#f4ead2]">
          {formatDexNumber(entry.dexNumber)}
        </span>
      </div>

      <div className="mt-5 grid min-h-[220px] place-items-center border border-[#4d5736] bg-[#252a1d]">
        {entry.unlocked && entry.iconPath ? (
          <img
            src={entry.iconPath}
            alt={`${entry.name} sprite`}
            className="h-40 w-40 object-contain [image-rendering:pixelated]"
          />
        ) : (
          <span className="font-mono text-7xl font-black text-[#83785f]">?</span>
        )}
      </div>

      {entry.unlocked ? (
        <div className="mt-5 space-y-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
              {t("pokemon.type")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {entry.types.length > 0 ? (
                entry.types.map((type) => <TypeBadge key={type} type={type} />)
              ) : (
                <TypeBadge type="unknown" />
              )}
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-3">
            <InfoBox label={t("pokedex.status")} value={statusValue} />
            <InfoBox
              label={t("pokedex.caughtLabel")}
              value={entry.caught ? t("common.yes") : t("common.no")}
            />
            <InfoBox label={t("pokedex.speciesLabel")} value={entry.species} />
          </dl>
        </div>
      ) : (
        <div className="mt-5 border border-dashed border-[#4d5736]/70 bg-[#10130d] p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
            {t("pokedex.lockedEntry")}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#b7a98b]">
            {t("pokedex.lockedEntryDescription")}
          </p>
        </div>
      )}

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <InfoBox label={t("pokedex.unlocked")} value={`${totalUnlocked}/${totalEntries}`} />
        <InfoBox label={t("pokedex.caughtLabel")} value={`${totalCaught}/${totalEntries}`} />
        <InfoBox
          label={t("pokedex.completion")}
          value={`${Math.round((totalCaught / Math.max(1, totalEntries)) * 100)}%`}
        />
      </dl>
    </aside>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#4d5736]/70 bg-[#10130d]/80 p-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#83785f]">{label}</dt>
      <dd className="mt-1 truncate font-mono text-sm font-black text-[#f4ead2]">{value}</dd>
    </div>
  );
}
