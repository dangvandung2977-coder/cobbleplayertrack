"use client";

import Image from "next/image";
import type { ApiPlayer } from "@/lib/api/types";
import { formatDateTime, formatRelativeTime } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/provider";
import { getPlayerPresence } from "@/lib/presence";

type PlayerHeaderProps = {
  player: ApiPlayer;
  partyCount: number;
};

export function PlayerHeader({ player, partyCount }: PlayerHeaderProps) {
  const { t } = useLanguage();
  const presence = getPlayerPresence(player);
  const locale = "en";

  return (
    <header className="game-panel-strong rounded-sm p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden border border-[#4d5736] bg-[#252a1d]">
            {player.skinUrl ? (
              <Image
                src={player.skinUrl}
                alt={`${player.name} skin`}
                width={80}
                height={80}
                className="h-full w-full object-contain [image-rendering:pixelated]"
              />
            ) : (
              <span className="font-mono text-2xl font-black text-[#d7ae45]">
                {player.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">
              {t("player.trainerFile")}
            </p>
            <h1 className="mt-1 truncate text-4xl font-black text-[#f4ead2]">{player.name}</h1>
            <p className="mt-2 break-all font-mono text-xs text-[#83785f]">{player.uuid}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span
            className={
              presence.isOnline
                ? "border border-[#79b86a]/70 bg-[#17301c] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#9be18c]"
                : "border border-[#83785f]/70 bg-[#191a16] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#b7a98b]"
            }
            title={
              presence.isStaleOnline
                ? t("player.staleOnlineTooltip")
                : undefined
            }
          >
            {presence.isOnline ? t("player.online") : t("player.offline")}
          </span>
          <span className="border border-[#4d5736] bg-[#15180f] px-4 py-2 text-sm font-black text-[#f4ead2]">
            {t("common.partySlots", { count: partyCount })}
          </span>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
            {t("player.server")}
          </dt>
          <dd className="mt-1 font-mono font-bold text-[#f4ead2]">{player.serverId}</dd>
        </div>
        <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
            {t("player.lastSeen")}
          </dt>
          <dd
            className="mt-1 font-bold text-[#f4ead2]"
            title={formatDateTime(player.lastSeen, locale)}
          >
            {formatRelativeTime(player.lastSeen, locale)}
          </dd>
        </div>
        <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">
            {t("player.firstSeen")}
          </dt>
          <dd className="mt-1 font-bold text-[#f4ead2]">
            {formatDateTime(player.firstSeen, locale)}
          </dd>
        </div>
      </dl>
    </header>
  );
}
