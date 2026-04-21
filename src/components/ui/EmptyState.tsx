"use client";

import { useLanguage } from "@/lib/i18n/provider";

type EmptyStateProps = {
  title: string;
  message: string;
  eyebrow?: string;
};

export function EmptyState({ title, message, eyebrow }: EmptyStateProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-md border border-dashed border-[#3f503f] bg-[#111511]/75 p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#67d8cf]">
        {eyebrow ?? t("common.noRecords")}
      </p>
      <h3 className="mt-2 text-xl font-black text-[#fff5de]">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#c1b59a]">{message}</p>
    </div>
  );
}
