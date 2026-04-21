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
    <div className={cn("game-panel p-5", className)} role="status" aria-live="polite">
      <div className="mb-5 flex items-center justify-between border-b border-[#3f503f]/70 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#67d8cf]">
            {t("common.syncing")}
          </p>
          <h2 className="mt-1 text-xl font-black text-[#fff5de]">{title ?? t(titleKey)}</h2>
        </div>
        <div className="h-3 w-3 animate-pulse rounded-full border border-[#67d8cf] bg-[#67d8cf]/30" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-md border border-[#3f503f]/60 bg-[#263126]/70" />
        ))}
      </div>
    </div>
  );
}
