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
    <div className="game-panel rounded-sm border-[#db704c]/60 p-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#db704c]">
        {t("common.error")}
      </p>
      <h2 className="mt-2 text-2xl font-black text-[#f4ead2]">{title ?? t(titleKey)}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#b7a98b]">
        {messageKey ? t(messageKey, messageValues) : message}
      </p>
      {actionHref && (actionLabel || actionLabelKey) ? (
        <Link
          href={actionHref}
          className="focus-ring mt-5 inline-block border border-[#db704c]/70 bg-[#2b1c16] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#f4ead2]"
        >
          {actionLabel ?? t(actionLabelKey!)}
        </Link>
      ) : null}
    </div>
  );
}
