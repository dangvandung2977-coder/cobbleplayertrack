"use client";

import { useLanguage } from "@/lib/i18n/provider";

type PokedexSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PokedexSearchBar({ value, onChange }: PokedexSearchBarProps) {
  const { t } = useLanguage();

  return (
    <label className="block">
      <span className="sr-only">{t("pokedex.search")}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        placeholder={t("pokedex.searchPlaceholder")}
        className="focus-ring w-full border border-[#4d5736] bg-[#10130d] px-4 py-3 font-mono text-sm font-bold text-[#f4ead2] placeholder:text-[#83785f]"
      />
    </label>
  );
}
