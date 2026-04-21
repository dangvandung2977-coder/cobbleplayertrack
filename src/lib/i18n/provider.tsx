"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  dictionaries,
  translate,
  type AppLanguage,
  type TranslationValues,
} from "@/lib/i18n";

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: string, values?: TranslationValues) => string;
  languages: AppLanguage[];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language: AppLanguage = "en";

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: () => undefined,
      t: (key, values) => translate(language, key, values),
      languages: Object.keys(dictionaries) as AppLanguage[],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
