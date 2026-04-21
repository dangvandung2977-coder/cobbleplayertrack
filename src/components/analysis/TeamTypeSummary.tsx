"use client";

import type { TeamAnalysisResult } from "@/lib/team-analysis";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/i18n/provider";
import { formatDexNumber } from "@/lib/pokedex";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

type TeamTypeSummaryProps = {
  analysis: TeamAnalysisResult;
};

export function TeamTypeSummary({ analysis }: TeamTypeSummaryProps) {
  const { t } = useLanguage();

  return (
    <section className="border border-[#4d5736]/70 bg-[#15180f]/85 p-4">
      <div className="flex flex-col gap-2 border-b border-[#4d5736]/70 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#d7ae45]">
            {t("analyze.teamTypeSummary")}
          </p>
          <h3 className="mt-1 text-xl font-black text-[#f4ead2]">
            {t("analyze.uniqueTypes", { count: analysis.uniqueTypes.length })}
          </h3>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
          {t("analyze.duplicateTypeGroups", { count: analysis.duplicateTypes.length })}
        </p>
      </div>

      <div className="mt-3 grid gap-2">
        {analysis.members.map((member) => (
          <div
            key={member.key}
            className="grid gap-3 border border-[#4d5736]/60 bg-[#10130d]/80 p-3 sm:grid-cols-[44px_1fr_auto] sm:items-center"
          >
            <div className="grid h-11 w-11 place-items-center border border-[#4d5736] bg-[#252a1d]">
              {member.spriteUrl ? (
                <img src={member.spriteUrl} alt="" className="h-10 w-10 object-contain [image-rendering:pixelated]" />
              ) : (
                <span className="font-mono text-sm font-black text-[#d7ae45]">?</span>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate font-black text-[#f4ead2]">{member.name}</p>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#83785f]">
                {formatDexNumber(member.dexNumber)} / {t("common.slot", { slot: formatSlot(member.slot) })}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {member.types.length > 0 ? (
                member.types.map((type) => (
                  <TypeBadge
                    key={type}
                    type={type}
                    compact
                    className={cn(member.duplicateTypes.includes(type) && "ring-2 ring-[#d7ae45]/60")}
                  />
                ))
              ) : (
                <TypeBadge type="unknown" compact />
              )}
            </div>
          </div>
        ))}
      </div>

      {analysis.duplicateTypes.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-[#4d5736]/70 pt-3">
          {analysis.duplicateTypes.map(({ type, count }) => (
            <span
              key={type}
              className="inline-flex items-center gap-2 border border-[#d7ae45]/60 bg-[#2b2515] px-2 py-1 font-mono text-[11px] font-black uppercase tracking-[0.1em] text-[#ffe0a3]"
            >
              <TypeBadge type={type} compact />
              x{count}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function formatSlot(slot: number) {
  return slot >= 1 && slot <= 6 ? slot : slot + 1;
}
