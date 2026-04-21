"use client";

import { useLanguage } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";
import { formatDexNumber, type PokedexDisplayEntry } from "@/lib/pokedex";

type PokedexEntryCardProps = {
  entry: PokedexDisplayEntry;
  selected: boolean;
  onSelect: () => void;
};

export function PokedexEntryCard({ entry, selected, onSelect }: PokedexEntryCardProps) {
  const { t } = useLanguage();
  const statusLabel = entry.caught
    ? t("pokedex.caughtLabel")
    : entry.seen
      ? t("pokedex.seen")
      : entry.unlocked
        ? t("pokedex.unlocked")
        : t("pokedex.locked");

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "focus-ring grid min-h-[74px] grid-cols-[52px_1fr] gap-3 border p-2 text-left transition",
        selected
          ? "border-[#d7ae45] bg-[#3a321d] shadow-[inset_0_0_0_2px_rgba(215,174,69,0.22)]"
          : entry.unlocked
            ? "border-[#4d5736]/70 bg-[#15180f]/85 hover:border-[#d7ae45]/70 hover:bg-[#1b1f16]"
            : "border-[#334022]/70 bg-[#10130d]/80 opacity-80 hover:border-[#83785f]/80",
      )}
    >
      <div
        className={cn(
          "grid h-[52px] w-[52px] place-items-center border font-mono text-xl font-black",
          entry.unlocked
            ? "border-[#4d5736] bg-[#252a1d] text-[#d7ae45]"
            : "border-dashed border-[#4d5736]/70 bg-[#15180f] text-[#83785f]",
        )}
      >
        {entry.unlocked && entry.iconPath ? (
          <img src={entry.iconPath} alt="" className="h-11 w-11 object-contain [image-rendering:pixelated]" />
        ) : (
          "?"
        )}
      </div>

      <div className="min-w-0 self-center">
        <p className="font-mono text-[11px] font-black uppercase tracking-[0.12em] text-[#d7ae45]">
          {formatDexNumber(entry.dexNumber)}
        </p>
        <p className={cn("mt-1 truncate text-sm font-black", entry.unlocked ? "text-[#f4ead2]" : "text-[#83785f]")}>
          {entry.unlocked ? entry.name : t("pokedex.unknownSpecies")}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#83785f]">
          {statusLabel}
        </p>
      </div>
    </button>
  );
}
