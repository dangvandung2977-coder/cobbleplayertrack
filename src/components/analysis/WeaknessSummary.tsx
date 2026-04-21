"use client";

import type { TeamAnalysisResult, TeamDefenseEntry } from "@/lib/team-analysis";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/i18n/provider";
import { TypeBadge, TypeIcon } from "@/components/pokemon/TypeBadge";

type WeaknessSummaryProps = {
  analysis: TeamAnalysisResult;
};

const SEVERITY_STYLES: Record<TeamDefenseEntry["severity"], string> = {
  critical: "border-[#db704c]/80 bg-[#321712] text-[#ffd3c5]",
  major: "border-[#d7ae45]/80 bg-[#302712] text-[#ffe7a3]",
  manageable: "border-[#83785f]/80 bg-[#242012] text-[#d8cba7]",
  minor: "border-[#4d5736]/80 bg-[#10130d] text-[#b7a98b]",
  none: "border-[#4d5736]/60 bg-[#10130d] text-[#83785f]",
};

export function WeaknessSummary({ analysis }: WeaknessSummaryProps) {
  const { t } = useLanguage();
  const weaknessRows = analysis.defensiveMatrix
    .filter((entry) => entry.severity !== "none")
    .sort((first, second) => severityRank(first.severity) - severityRank(second.severity));

  return (
    <section className="border border-[#4d5736]/70 bg-[#15180f]/85 p-4">
      <div className="border-b border-[#4d5736]/70 pb-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#d7ae45]">
          {t("analyze.defensiveOverview")}
        </p>
        <h3 className="mt-1 text-xl font-black text-[#f4ead2]">
          {t("analyze.weaknessStacksSafePivots")}
        </h3>
      </div>

      <div className="mt-3 grid gap-2">
        {weaknessRows.length > 0 ? (
          weaknessRows.slice(0, 8).map((entry) => (
            <div
              key={entry.type}
              className={cn("grid gap-3 border p-3 md:grid-cols-[120px_1fr] md:items-center", SEVERITY_STYLES[entry.severity])}
            >
              <div className="flex items-center gap-2">
                <TypeIcon type={entry.type} />
                <span className="font-black capitalize">{entry.type}</span>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em]">
                {t("analyze.weaknessRow", {
                  severity: t(`common.severity.${entry.severity}`),
                  weak: entry.weakCount + entry.quadWeakCount,
                  resist: entry.resistCount + entry.doubleResistCount,
                  immune: entry.immuneCount,
                })}
              </p>
            </div>
          ))
        ) : (
          <div className="border border-dashed border-[#4d5736]/70 bg-[#10130d] p-4 text-sm text-[#b7a98b]">
            {t("analyze.noSharedWeaknessStacks")}
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ChipGroup title={t("analyze.immunities")} types={analysis.immunities} fallback={t("analyze.noImmunities")} />
        <ChipGroup
          title={t("analyze.resistanceHighlights")}
          types={analysis.resistHighlights}
          fallback={t("analyze.noStackedResistances")}
        />
      </div>
    </section>
  );
}

function ChipGroup({ title, types, fallback }: { title: string; types: string[]; fallback: string }) {
  return (
    <div className="border border-[#4d5736]/70 bg-[#10130d]/80 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#83785f]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {types.length > 0 ? (
          types.map((type) => <TypeBadge key={type} type={type} compact />)
        ) : (
          <span className="text-sm text-[#b7a98b]">{fallback}</span>
        )}
      </div>
    </div>
  );
}

function severityRank(severity: TeamDefenseEntry["severity"]) {
  switch (severity) {
    case "critical":
      return 0;
    case "major":
      return 1;
    case "manageable":
      return 2;
    case "minor":
      return 3;
    default:
      return 4;
  }
}
