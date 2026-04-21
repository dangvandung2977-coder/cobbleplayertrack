"use client";

import type { AnalysisBadge } from "@/lib/team-analysis";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/i18n/provider";

type AnalysisBadgeListProps = {
  badges: AnalysisBadge[];
};

const BADGE_STYLES: Record<AnalysisBadge["severity"], string> = {
  good: "border-[#79b86a]/70 bg-[#17301c] text-[#c9f4bf]",
  info: "border-[#59c7d4]/70 bg-[#132c31] text-[#cceff4]",
  warn: "border-[#d7ae45]/70 bg-[#302712] text-[#ffe7a3]",
  danger: "border-[#db704c]/80 bg-[#321712] text-[#ffd3c5]",
};

export function AnalysisBadgeList({ badges }: AnalysisBadgeListProps) {
  const { t } = useLanguage();

  if (badges.length === 0) {
    return (
      <div className="border border-dashed border-[#4d5736]/70 bg-[#10130d] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
          {t("empty.noBadgesTitle")}
        </p>
        <p className="mt-2 text-sm text-[#b7a98b]">{t("empty.noBadgesMessage")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {badges.map((badge) => (
        <div key={badge.id} className={cn("border p-3", BADGE_STYLES[badge.severity])}>
          <p className="font-black">
            {badge.translationKey
              ? t(`${badge.translationKey}.label`, badge.translationValues)
              : badge.label}
          </p>
          <p className="mt-1 text-xs leading-5 opacity-85">
            {badge.translationKey
              ? t(`${badge.translationKey}.reason`, badge.translationValues)
              : badge.reason}
          </p>
        </div>
      ))}
    </div>
  );
}
