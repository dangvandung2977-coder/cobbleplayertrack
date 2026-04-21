"use client";

import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/i18n/provider";
import type {
  ReplacementSuggestion,
  TeamReplacementSuggestions as TeamReplacementSuggestionsValue,
} from "@/lib/team-analysis";

type TeamReplacementSuggestionsProps = {
  suggestions: TeamReplacementSuggestionsValue;
};

const SUGGESTION_STYLES: Record<ReplacementSuggestion["severity"], string> = {
  danger: "border-[#db704c]/80 bg-[#321712] text-[#ffd3c5]",
  warn: "border-[#d7ae45]/80 bg-[#302712] text-[#ffe7a3]",
  info: "border-[#59c7d4]/70 bg-[#132c31] text-[#cceff4]",
};

export function TeamReplacementSuggestions({
  suggestions,
}: TeamReplacementSuggestionsProps) {
  const { t } = useLanguage();

  return (
    <section className="border border-[#4d5736]/70 bg-[#15180f]/85 p-4">
      <div className="border-b border-[#4d5736]/70 pb-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#d7ae45]">
          {t("analyze.replaceSection")}
        </p>
        <h3 className="mt-1 text-xl font-black text-[#f4ead2]">
          {t("analyze.replaceSectionSubtitle")}
        </h3>
      </div>

      <div className="mt-4 grid gap-4 2xl:grid-cols-2">
        <SuggestionColumn
          title={t("analyze.singlesReplacement")}
          suggestions={suggestions.singles}
          fallback={t("analyze.noSinglesReplacement")}
        />
        <SuggestionColumn
          title={t("analyze.doublesReplacement")}
          suggestions={suggestions.doubles}
          fallback={t("analyze.noDoublesReplacement")}
        />
      </div>
    </section>
  );
}

function SuggestionColumn({
  title,
  suggestions,
  fallback,
}: {
  title: string;
  suggestions: ReplacementSuggestion[];
  fallback: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="border border-[#4d5736]/70 bg-[#10130d]/80 p-4">
      <div className="flex items-center justify-between gap-3 border-b border-[#4d5736]/70 pb-3">
        <h4 className="text-lg font-black text-[#f4ead2]">{title}</h4>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#83785f]">
          {suggestions.length === 1
            ? t("common.noteSingle", { count: suggestions.length })
            : t("common.notePlural", { count: suggestions.length })}
        </span>
      </div>

      {suggestions.length > 0 ? (
        <div className="mt-4 space-y-3">
          {suggestions.map((suggestion) => {
            const titleText = suggestion.translationKey
              ? t(`${suggestion.translationKey}.title`, suggestion.translationValues)
              : suggestion.title;
            const whyText = suggestion.translationKey
              ? t(`${suggestion.translationKey}.why`, suggestion.translationValues)
              : suggestion.whyReplace;
            const recommendationText = suggestion.translationKey
              ? t(`${suggestion.translationKey}.recommendation`, suggestion.translationValues)
              : suggestion.recommendation;
            const improvementText = suggestion.translationKey
              ? t(`${suggestion.translationKey}.expectedImprovement`, suggestion.translationValues)
              : suggestion.expectedImprovement;

            return (
              <article
                key={suggestion.id}
                className={cn("border p-4", SUGGESTION_STYLES[suggestion.severity])}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border border-current/35 bg-black/15 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.14em]">
                    {t(`common.severity.${suggestion.severity}`)}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-80">
                    {t(`replacement.categories.${suggestion.category}`)}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-80">
                    {t(`analyze.replacementMode${capitalize(suggestion.mode)}`)}
                  </span>
                </div>

                <h5 className="mt-3 text-lg font-black">{titleText}</h5>

                <div className="mt-3 space-y-3 text-sm leading-6">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-80">
                      {t("common.replaceCandidate")}
                    </p>
                    <p className="mt-1">{suggestion.replaceCandidate}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-80">
                      {t("common.why")}
                    </p>
                    <p className="mt-1">{whyText}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-80">
                      {t("common.recommendation")}
                    </p>
                    <p className="mt-1">{recommendationText}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-80">
                      {t("common.expectedImprovement")}
                    </p>
                    <p className="mt-1">{improvementText}</p>
                  </div>
                  {suggestion.examples?.length ? (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-80">
                        {t("common.examples")}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {suggestion.examples.map((example) => (
                          <span
                            key={example}
                            className="border border-current/35 bg-black/15 px-2 py-1 text-xs font-bold"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 border border-dashed border-[#4d5736]/70 bg-[#15180f]/70 p-4 text-sm text-[#b7a98b]">
          {fallback}
        </div>
      )}
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
