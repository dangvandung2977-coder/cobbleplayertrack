"use client";

import { useMemo } from "react";
import type { PartyPokemon } from "@/lib/api/types";
import { useLanguage } from "@/lib/i18n/provider";
import { analyzeTeam } from "@/lib/team-analysis";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnalysisBadgeList } from "@/components/analysis/AnalysisBadgeList";
import { CoverageSummary } from "@/components/analysis/CoverageSummary";
import { TeamTypeSummary } from "@/components/analysis/TeamTypeSummary";
import { WeaknessSummary } from "@/components/analysis/WeaknessSummary";
import { TeamRebuildSuggestions } from "@/components/team-analyze/TeamRebuildSuggestions";
import { TeamReplacementSuggestions } from "@/components/team-analyze/TeamReplacementSuggestions";

type TeamAnalyzePanelProps = {
  party: PartyPokemon[];
};

export function TeamAnalyzePanel({ party }: TeamAnalyzePanelProps) {
  const { t } = useLanguage();
  const analysis = useMemo(() => analyzeTeam(party), [party]);

  if (analysis.teamSize === 0) {
    return (
      <EmptyState
        title={t("empty.noTeamAnalyzeTitle")}
        message={t("empty.noTeamAnalyzeMessage")}
      />
    );
  }

  const analyzerMode =
    analysis.dataLevel === "types"
      ? t("analyze.modeTypes")
      : analysis.dataLevel === "types+moves"
        ? t("analyze.modeTypesMoves")
        : t("analyze.modeTypesMovesStats");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border border-[#4d5736]/70 bg-[#15180f]/85 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
            {t("analyze.analyzerMode")}
          </p>
          <p className="mt-1 font-bold text-[#f4ead2]">{analyzerMode}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <MiniMetric label={t("analyze.metricTeam")} value={`${analysis.teamSize}/6`} />
          <MiniMetric label={t("analyze.metricTypes")} value={`${analysis.uniqueTypes.length}`} />
          <MiniMetric label={t("analyze.metricGaps")} value={`${analysis.missingCoverageTypes.length}`} />
        </div>
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <TeamTypeSummary analysis={analysis} />
          <CoverageSummary analysis={analysis} />
          <WeaknessSummary analysis={analysis} />
        </div>

        <aside className="space-y-4">
          <section className="border border-[#4d5736]/70 bg-[#15180f]/85 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#d7ae45]">
              {t("analyze.evaluationBadges")}
            </p>
            <div className="mt-3">
              <AnalysisBadgeList badges={analysis.badges} />
            </div>
          </section>

          <OptionalInsights analysis={analysis} />
        </aside>
      </div>

      <TeamReplacementSuggestions suggestions={analysis.replacementSuggestions} />
      <TeamRebuildSuggestions suggestions={analysis.rebuildSuggestions} />
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-20 border border-[#4d5736]/70 bg-[#10130d] px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#83785f]">{label}</p>
      <p className="mt-1 font-mono text-lg font-black text-[#f4ead2]">{value}</p>
    </div>
  );
}

function OptionalInsights({ analysis }: { analysis: ReturnType<typeof analyzeTeam> }) {
  const { t } = useLanguage();
  const split = analysis.optional?.physicalSpecialSplit;
  const speed = analysis.optional?.speedProfile;

  if (!split && !speed) {
    return (
      <section className="border border-dashed border-[#4d5736]/70 bg-[#10130d] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
          {t("analyze.extraHeuristics")}
        </p>
        <p className="mt-2 text-sm leading-6 text-[#b7a98b]">
          {t("analyze.extraHeuristicsEmpty")}
        </p>
      </section>
    );
  }

  return (
    <section className="border border-[#4d5736]/70 bg-[#15180f]/85 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#d7ae45]">
        {t("analyze.extraHeuristics")}
      </p>
      <div className="mt-3 grid gap-2">
        {split ? (
          <InsightRow
            label={t("analyze.offenseSplit")}
            value={`${split.leaning.toUpperCase()} · P${split.physical} / S${split.special} / Status ${split.status}`}
          />
        ) : null}
        {speed ? (
          <InsightRow
            label={t("analyze.speedProfile")}
            value={`${speed.label} · slow ${speed.slow}, mid ${speed.mid}, fast ${speed.fast}, very fast ${speed.veryFast}`}
          />
        ) : null}
      </div>
    </section>
  );
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#4d5736]/70 bg-[#10130d]/80 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#83785f]">{label}</p>
      <p className="mt-1 text-sm font-bold leading-6 text-[#f4ead2]">{value}</p>
    </div>
  );
}
