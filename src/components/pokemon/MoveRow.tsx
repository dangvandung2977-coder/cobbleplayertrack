"use client";

import { useState, type CSSProperties, type FocusEvent, type PointerEvent } from "react";
import type { MoveValue } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/i18n/provider";
import { getMoveInfo, titleCaseIdentifier } from "@/lib/pokemon";
import { TypeIcon } from "@/components/pokemon/TypeBadge";

type MoveRowProps = {
  move?: MoveValue;
  index: number;
};

const DETAIL_WIDTH = 380;
const DETAIL_ESTIMATED_HEIGHT = 318;
const DETAIL_GAP = 18;

const MOVE_TYPE_ROW_STYLES: Record<string, string> = {
  normal: "border-[#4d5736]/70 border-l-[#b8ad8f] bg-[#17170f]",
  fire: "border-[#6f3925]/80 border-l-[#e67a44] bg-[#21120d]",
  water: "border-[#274d64]/80 border-l-[#4aa7df] bg-[#101b25]",
  grass: "border-[#31572e]/80 border-l-[#79b86a] bg-[#111f14]",
  electric: "border-[#6c5a1f]/80 border-l-[#e4c948] bg-[#211d0d]",
  ice: "border-[#2d5e65]/80 border-l-[#85d8e7] bg-[#102226]",
  fighting: "border-[#693329]/80 border-l-[#cf5e48] bg-[#21100d]",
  poison: "border-[#593466]/80 border-l-[#b070ce] bg-[#1f1325]",
  ground: "border-[#614a22]/80 border-l-[#d6ae63] bg-[#20190e]",
  flying: "border-[#405174]/80 border-l-[#93b2ec] bg-[#151a29]",
  psychic: "border-[#71364f]/80 border-l-[#e776a9] bg-[#25121c]",
  bug: "border-[#53652a]/80 border-l-[#a4c85f] bg-[#1a2110]",
  rock: "border-[#5f5127]/80 border-l-[#c6ae69] bg-[#1d190f]",
  ghost: "border-[#493f70]/80 border-l-[#8e80d5] bg-[#171224]",
  dragon: "border-[#3d3874]/80 border-l-[#776fe4] bg-[#15132a]",
  dark: "border-[#45414c]/80 border-l-[#746d7b] bg-[#151318]",
  steel: "border-[#4c5662]/80 border-l-[#a8b3c2] bg-[#151b20]",
  fairy: "border-[#74455b]/80 border-l-[#eca3c7] bg-[#251421]",
  unknown: "border-[#4d5736]/70 border-l-[#83785f] bg-[#15180f]",
};

const TYPE_SLOT_STYLES: Record<string, string> = {
  normal: "border-[#b8ad8f] bg-[#4d4735]",
  fire: "border-[#e67a44] bg-[#4d241b]",
  water: "border-[#4aa7df] bg-[#15324d]",
  grass: "border-[#79b86a] bg-[#193d25]",
  electric: "border-[#e4c948] bg-[#4a3c12]",
  ice: "border-[#85d8e7] bg-[#173f49]",
  fighting: "border-[#cf5e48] bg-[#4b211b]",
  poison: "border-[#b070ce] bg-[#3a214a]",
  ground: "border-[#d6ae63] bg-[#47361a]",
  flying: "border-[#93b2ec] bg-[#273350]",
  psychic: "border-[#e776a9] bg-[#4d2039]",
  bug: "border-[#a4c85f] bg-[#344217]",
  rock: "border-[#c6ae69] bg-[#40351c]",
  ghost: "border-[#8e80d5] bg-[#292044]",
  dragon: "border-[#776fe4] bg-[#211d50]",
  dark: "border-[#746d7b] bg-[#24212b]",
  steel: "border-[#a8b3c2] bg-[#28313a]",
  fairy: "border-[#eca3c7] bg-[#4b253c]",
  unknown: "border-[#83785f] bg-[#252a1d]",
};

const CATEGORY_STYLES: Record<string, string> = {
  physical: "border-[#d2785d] bg-[#3a1d15] text-[#ffd7c8]",
  special: "border-[#5aa3db] bg-[#142b3f] text-[#d0ecff]",
  status: "border-[#c5ad5a] bg-[#312b13] text-[#fff0a8]",
  unknown: "border-[#4d5736] bg-[#252a1d] text-[#d8cba7]",
};

function formatPpLabel(pp: number | undefined, maxPp: number | undefined) {
  if (pp !== undefined && maxPp !== undefined) {
    return `${pp}/${maxPp}`;
  }

  if (pp !== undefined) {
    return `${pp}/--`;
  }

  return maxPp !== undefined ? `--/${maxPp}` : "--";
}

function formatOptionalLabel(value: string | number | undefined) {
  if (value === undefined || value === "") {
    return "--";
  }

  return typeof value === "number" ? value.toString() : titleCaseIdentifier(value);
}

function MoveDetailValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#4d5736]/60 bg-[#15180f]/80 px-3 py-2">
      <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#83785f]">{label}</dt>
      <dd className="mt-1 font-mono text-sm font-black text-[#f4ead2]">{value}</dd>
    </div>
  );
}

function getCursorDetailStyle(clientX: number, clientY: number): CSSProperties {
  const maxLeft = Math.max(12, window.innerWidth - DETAIL_WIDTH - 12);
  const left = Math.max(12, Math.min(clientX + DETAIL_GAP, maxLeft));
  const wouldOverflowBottom = clientY + DETAIL_GAP + DETAIL_ESTIMATED_HEIGHT > window.innerHeight;
  const top = wouldOverflowBottom
    ? Math.max(12, clientY - DETAIL_ESTIMATED_HEIGHT - DETAIL_GAP)
    : clientY + DETAIL_GAP;

  return {
    left,
    top,
    width: DETAIL_WIDTH,
  };
}

export function MoveRow({ move, index }: MoveRowProps) {
  const { t } = useLanguage();
  const [detailStyle, setDetailStyle] = useState<CSSProperties | null>(null);
  const moveInfo = getMoveInfo(move, index);
  const hasMove = Boolean(move);
  const type = (moveInfo.type ?? "unknown").toLowerCase();
  const category = (moveInfo.category ?? "Unknown").toLowerCase();
  const categoryLabel = moveInfo.category ?? "Category ?";
  const damageStatLabel = moveInfo.damageStat && moveInfo.damageStat !== "Status" ? moveInfo.damageStat : "--";
  const effectText = hasMove
    ? moveInfo.effect ?? t("pokemon.moveMetadataUnavailable")
    : t("pokemon.noMoveLearned");
  const ppLabel = formatPpLabel(moveInfo.pp, moveInfo.maxPp);
  const detailId = `move-detail-${index}`;
  const extraLabel =
    [
      moveInfo.multiHitLabel,
      moveInfo.effectChanceLabel ? `Effect ${moveInfo.effectChanceLabel}` : undefined,
    ]
      .filter(Boolean)
      .join(" / ") || "--";

  function showDetailAtPointer(event: PointerEvent<HTMLDivElement>) {
    if (!hasMove) {
      return;
    }

    setDetailStyle(getCursorDetailStyle(event.clientX, event.clientY));
  }

  function showDetailOnFocus(event: FocusEvent<HTMLDivElement>) {
    if (!hasMove) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setDetailStyle(getCursorDetailStyle(rect.left + 24, rect.bottom));
  }

  return (
    <div
      tabIndex={hasMove ? 0 : -1}
      aria-describedby={hasMove ? detailId : undefined}
      onPointerEnter={showDetailAtPointer}
      onPointerMove={showDetailAtPointer}
      onPointerLeave={() => setDetailStyle(null)}
      onFocus={showDetailOnFocus}
      onBlur={() => setDetailStyle(null)}
      className={cn(
        "relative grid gap-3 border border-l-4 p-4 outline-none transition focus-visible:border-[#d7ae45] md:grid-cols-[60px_minmax(0,1fr)_94px]",
        hasMove
          ? (MOVE_TYPE_ROW_STYLES[type] ?? MOVE_TYPE_ROW_STYLES.unknown)
          : "border-dashed border-[#4d5736]/60 border-l-[#4d5736] bg-[#15180f]/45 opacity-75",
      )}
    >
      <div
        className={cn(
          "grid h-[60px] w-[60px] place-items-center border shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
          TYPE_SLOT_STYLES[hasMove ? type : "unknown"] ?? TYPE_SLOT_STYLES.unknown,
        )}
        title={titleCaseIdentifier(type)}
      >
        <span className="sr-only">{t("pokemon.moveType", { type: titleCaseIdentifier(type) })}</span>
        <TypeIcon
          type={hasMove ? type : "unknown"}
          bare
          className="h-9 w-9"
          iconClassName="h-8 w-8 drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]"
        />
      </div>

      <div className="min-w-0 self-center">
        <p className="truncate text-lg font-black text-[#f4ead2]">
          {hasMove ? moveInfo.name : t("pokemon.emptyMoveSlot")}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.1em]",
              CATEGORY_STYLES[category] ?? CATEGORY_STYLES.unknown,
            )}
          >
            {categoryLabel}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#b7a98b]">
            {t("pokemon.power")} {moveInfo.powerLabel ?? "--"}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#b7a98b]">
            {t("pokemon.acc")} {moveInfo.accuracyLabel ?? "--"}
          </span>
        </div>
      </div>

      <div className="grid h-[60px] place-items-center border border-[#4d5736]/70 bg-[#252a1d] px-3 py-2 text-center">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">{t("pokemon.pp")}</p>
          <p className="mt-1 whitespace-nowrap font-mono text-lg font-black text-[#f4ead2]">{ppLabel}</p>
        </div>
      </div>

      {hasMove && detailStyle ? (
        <div
          id={detailId}
          className="pointer-events-none fixed z-50"
          style={detailStyle}
        >
          <div className="border border-[#d7ae45]/80 bg-[#10130d] p-4 shadow-[0_12px_24px_rgba(0,0,0,0.45)]">
            <div className="flex items-start gap-3 border-b border-[#4d5736]/70 pb-3">
              <TypeIcon
                type={type}
                bare
                className="mt-1 h-8 w-8 border border-[#4d5736] bg-[#252a1d]"
                iconClassName="h-6 w-6"
              />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#d7ae45]">
                  {t("pokemon.moveDetail")}
                </p>
                <p className="mt-1 text-lg font-black text-[#f4ead2]">{moveInfo.name}</p>
                <p className="mt-1 text-sm leading-6 text-[#b7a98b]">{effectText}</p>
              </div>
            </div>

            <dl className="mt-3 grid gap-2 sm:grid-cols-3">
              <MoveDetailValue label={t("pokemon.type")} value={titleCaseIdentifier(type)} />
              <MoveDetailValue label={t("pokemon.category")} value={categoryLabel} />
              <MoveDetailValue label={t("pokemon.damageStat")} value={damageStatLabel} />
              <MoveDetailValue label={t("pokemon.power")} value={moveInfo.powerLabel ?? "--"} />
              <MoveDetailValue label={t("pokemon.accuracy")} value={moveInfo.accuracyLabel ?? "--"} />
              <MoveDetailValue label={t("pokemon.pp")} value={ppLabel} />
              <MoveDetailValue label={t("pokemon.target")} value={formatOptionalLabel(moveInfo.target)} />
              <MoveDetailValue label={t("pokemon.priority")} value={formatOptionalLabel(moveInfo.priority)} />
              <MoveDetailValue label={t("pokemon.extra")} value={extraLabel} />
            </dl>
          </div>
        </div>
      ) : null}
    </div>
  );
}
