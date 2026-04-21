"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/provider";
import type { TranslationValues } from "@/lib/i18n";

type ErrorStateProps = {
  title?: string;
  titleKey?: string;
  message?: string;
  messageKey?: string;
  messageValues?: TranslationValues;
  actionHref?: string;
  actionLabel?: string;
  actionLabelKey?: string;
};

export function ErrorState({
  title,
  titleKey = "states.fieldConsoleInterrupted",
  message,
  messageKey,
  messageValues,
  actionHref,
  actionLabel,
  actionLabelKey,
}: ErrorStateProps) {
  const { t } = useLanguage();

  return (
    <div className="game-panel border-[#ee765f]/60 p-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#ee765f]">
        {t("common.error")}
      </p>
      <h2 className="mt-2 text-2xl font-black text-[#fff5de]">{title ?? t(titleKey)}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#c1b59a]">
        {messageKey ? t(messageKey, messageValues) : message}
      </p>
      {actionHref && (actionLabel || actionLabelKey) ? (
        <Link
          href={actionHref}
          className="focus-ring mt-5 inline-block rounded-md border border-[#ee765f]/70 bg-[#2d1d18] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#fff5de] transition hover:bg-[#3a241e]"
        >
          {actionLabel ?? t(actionLabelKey!)}
        </Link>
      ) : null}
    </div>
  );
}
