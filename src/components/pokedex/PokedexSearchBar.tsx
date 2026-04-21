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
      <span className="flex w-full items-center gap-3 rounded-md border border-[#3f503f] bg-[#10130f] px-4 py-3 transition focus-within:border-[#67d8cf]">
        <span aria-hidden="true" className="font-mono text-sm text-[#67d8cf]">
          #
        </span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type="search"
          placeholder={t("pokedex.searchPlaceholder")}
          className="focus-ring w-full bg-transparent font-mono text-sm font-bold text-[#fff5de] outline-none placeholder:text-[#8c9a86]"
        />
      </span>
    </label>
  );
}
