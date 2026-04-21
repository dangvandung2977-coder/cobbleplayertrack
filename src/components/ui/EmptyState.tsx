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
    <div className="border border-dashed border-[#4d5736] bg-[#15180f]/70 p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">
        {eyebrow ?? t("common.noRecords")}
      </p>
      <h3 className="mt-2 text-xl font-black text-[#f4ead2]">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-[#b7a98b]">{message}</p>
    </div>
  );
}
