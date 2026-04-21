export { default as en } from "@/lib/i18n/en";

import en from "@/lib/i18n/en";

export const dictionaries = {
  en,
} as const;

export type AppLanguage = keyof typeof dictionaries;
export type TranslationValues = Record<string, string | number | undefined | null>;

function getDictionaryValue(source: unknown, key: string) {
  return key.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, source);
}

export function translate(
  language: AppLanguage,
  key: string,
  values?: TranslationValues,
) {
  const raw =
    getDictionaryValue(dictionaries[language], key) ??
    getDictionaryValue(dictionaries.en, key);

  if (typeof raw !== "string") {
    return key;
  }

  return raw.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = values?.[token];
    return value === undefined || value === null ? `{${token}}` : String(value);
  });
}

export function isValidLanguage(value: string | null | undefined): value is AppLanguage {
  return value === "en";
}
