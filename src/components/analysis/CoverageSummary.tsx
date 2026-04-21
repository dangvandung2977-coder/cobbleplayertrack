"use client";

import type { TeamAnalysisResult } from "@/lib/team-analysis";
import { useLanguage } from "@/lib/i18n/provider";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { CoverageBoard } from "@/components/analysis/CoverageBoard";

type CoverageSummaryProps = {
  analysis: TeamAnalysisResult;
};

export function CoverageSummary({ analysis }: CoverageSummaryProps) {
  const { t } = useLanguage();

  return (
    <section className="border border-[#4d5736]/70 bg-[#15180f]/85 p-4">
      <div className="border-b border-[#4d5736]/70 pb-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#d7ae45]">
          {t("analyze.offensiveCoverage")}
        </p>
        <h3 className="mt-1 text-xl font-black text-[#f4ead2]">
          {analysis.dataLevel === "types" ? t("analyze.stabFallback") : t("analyze.knownDamagingMoves")}
        </h3>
      </div>

      <div className="mt-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
          {t("analyze.attackTypes")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {analysis.attackTypes.length > 0 ? (
            analysis.attackTypes.map((type) => <TypeBadge key={type} type={type} compact />)
          ) : (
            <TypeBadge type="unknown" compact />
          )}
        </div>
      </div>

      <div className="mt-4">
        <CoverageBoard entries={analysis.offenseMatrix} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <CoverageNote
          label={t("analyze.strongCoverage")}
          value={
            analysis.strongCoverageTypes.length > 0
              ? analysis.strongCoverageTypes.map(formatType).join(", ")
              : t("analyze.noCoverageYet")
          }
        />
        <CoverageNote
          label={t("analyze.missingCoverage")}
          value={
            analysis.missingCoverageTypes.length > 0
              ? analysis.missingCoverageTypes.map(formatType).join(", ")
              : t("analyze.noMajorGaps")
          }
        />
      </div>
    </section>
  );
}

function CoverageNote({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#4d5736]/70 bg-[#10130d]/80 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#83785f]">{label}</p>
      <p className="mt-1 text-sm font-bold leading-6 text-[#f4ead2]">{value}</p>
    </div>
  );
}

function formatType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
