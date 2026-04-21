"use client";

import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/i18n/provider";

export type StatMode = "stats" | "ivs" | "evs" | "other";

type StatSubTabsProps = {
  activeMode: StatMode;
  onModeChange: (mode: StatMode) => void;
};

export function StatSubTabs({ activeMode, onModeChange }: StatSubTabsProps) {
  const { t } = useLanguage();
  const statModes: Array<{ id: StatMode; label: string }> = [
    { id: "stats", label: t("pokemon.statTabs.stats") },
    { id: "ivs", label: t("pokemon.statTabs.ivs") },
    { id: "evs", label: t("pokemon.statTabs.evs") },
    { id: "other", label: t("pokemon.statTabs.other") },
  ];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("pokemon.statLens")}>
      {statModes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onModeChange(mode.id)}
          role="tab"
          aria-selected={activeMode === mode.id}
          className={cn(
            "focus-ring border px-3 py-2 text-xs font-black uppercase tracking-[0.1em] transition",
            activeMode === mode.id
              ? "border-[#d7ae45] bg-[#d7ae45] text-[#15180f]"
              : "border-[#4d5736] bg-[#15180f] text-[#f4ead2] hover:border-[#d7ae45]/70",
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
