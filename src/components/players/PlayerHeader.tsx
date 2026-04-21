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
    <header className="game-panel-strong p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-md border border-[#3f503f] bg-[#263126]">
            {player.skinUrl ? (
              <Image
                src={player.skinUrl}
                alt={`${player.name} skin`}
                width={80}
                height={80}
                className="pixel-art h-full w-full object-contain"
              />
            ) : (
              <span className="font-mono text-2xl font-black text-[#f0bf54]">
                {player.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#67d8cf]">
              {t("player.trainerFile")}
            </p>
            <h1 className="mt-1 truncate text-4xl font-black text-[#fff5de]">{player.name}</h1>
            <p className="mt-2 break-all font-mono text-xs text-[#8c9a86]">{player.uuid}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span
            className={
              presence.isOnline
                ? "inline-flex items-center gap-2 rounded-md border border-[#7ed36f]/70 bg-[#17341c] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#9ff28d]"
                : "inline-flex items-center gap-2 rounded-md border border-[#8c9a86]/55 bg-[#171a16] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#c1b59a]"
            }
            title={
              presence.isStaleOnline
                ? t("player.staleOnlineTooltip")
                : undefined
            }
          >
            <span className="status-dot" />
            {presence.isOnline ? t("player.online") : t("player.offline")}
          </span>
          <span className="rounded-md border border-[#3f503f] bg-[#111511] px-4 py-2 text-sm font-black text-[#fff5de]">
            {t("common.partySlots", { count: partyCount })}
          </span>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="stat-tile p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">
            {t("player.server")}
          </dt>
          <dd className="mt-1 font-mono font-bold text-[#fff5de]">{player.serverId}</dd>
        </div>
        <div className="stat-tile p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">
            {t("player.lastSeen")}
          </dt>
          <dd
            className="mt-1 font-bold text-[#fff5de]"
            title={formatDateTime(player.lastSeen, locale)}
          >
            {formatRelativeTime(player.lastSeen, locale)}
          </dd>
        </div>
        <div className="stat-tile p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">
            {t("player.firstSeen")}
          </dt>
          <dd className="mt-1 font-bold text-[#fff5de]">
            {formatDateTime(player.firstSeen, locale)}
          </dd>
        </div>
      </dl>
    </header>
  );
}
