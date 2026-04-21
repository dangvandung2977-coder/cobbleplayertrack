"use client";

import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/i18n/provider";

type LoadingStateProps = {
  title?: string;
  titleKey?: string;
  rows?: number;
  className?: string;
};

export function LoadingState({
  title,
  titleKey = "states.loadingFieldData",
  rows = 4,
  className,
}: LoadingStateProps) {
  const { t } = useLanguage();

  return (
    <div className={cn("game-panel rounded-sm p-5", className)} role="status" aria-live="polite">
      <div className="mb-5 flex items-center justify-between border-b border-[#4d5736]/70 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">
            {t("common.syncing")}
          </p>
          <h2 className="mt-1 text-xl font-black text-[#f4ead2]">{title ?? t(titleKey)}</h2>
        </div>
        <div className="h-3 w-3 animate-pulse border border-[#59c7d4] bg-[#59c7d4]/30" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse border border-[#4d5736]/60 bg-[#252a1d]/70" />
        ))}
      </div>
    </div>
  );
}
