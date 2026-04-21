"use client";

import type { TeamOffenseEntry } from "@/lib/team-analysis";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/i18n/provider";
import { TypeIcon } from "@/components/pokemon/TypeBadge";

type CoverageBoardProps = {
  entries: TeamOffenseEntry[];
};

const STATUS_STYLES: Record<TeamOffenseEntry["status"], string> = {
  strong: "border-[#79b86a]/70 bg-[#17301c] text-[#c9f4bf]",
  basic: "border-[#d7ae45]/70 bg-[#302712] text-[#ffe7a3]",
  missing: "border-[#4d5736]/70 bg-[#10130d] text-[#83785f]",
};

export function CoverageBoard({ entries }: CoverageBoardProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-6">
      {entries.map((entry) => (
        <div key={entry.defendingType} className={cn("border p-2", STATUS_STYLES[entry.status])}>
          <div className="flex items-center gap-2">
            <TypeIcon type={entry.defendingType} />
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.1em]">
              {entry.defendingType}
            </span>
          </div>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em]">
            {entry.status === "strong"
              ? `${entry.sourceCount} answers`
              : entry.status === "basic"
                ? "1 answer"
                : t("analyze.missingCoverage")}
          </p>
        </div>
      ))}
    </div>
  );
}
