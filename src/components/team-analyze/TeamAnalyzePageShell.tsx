"use client";

import type { PartyPokemon } from "@/lib/api/types";
import { useLanguage } from "@/lib/i18n/provider";
import { TeamAnalyzePanel } from "@/components/analysis/TeamAnalyzePanel";
import { SectionPanel } from "@/components/ui/SectionPanel";

type TeamAnalyzePageShellProps = {
  party: PartyPokemon[];
};

export function TeamAnalyzePageShell({
  party,
}: TeamAnalyzePageShellProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <SectionPanel
        eyebrow={t("analyze.battlePlanner")}
        title={t("analyze.title")}
        description={t("analyze.description")}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <InfoChip label={t("analyze.coverageSource")} value={t("analyze.coverageSourceValue")} />
          <InfoChip label={t("analyze.defenseModel")} value={t("analyze.defenseModelValue")} />
          <InfoChip label={t("analyze.rebuildNotes")} value={t("analyze.rebuildNotesValue")} />
        </div>
      </SectionPanel>

      <TeamAnalyzePanel party={party} />
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#83785f]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[#f4ead2]">{value}</p>
    </div>
  );
}
