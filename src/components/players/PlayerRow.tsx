import Link from "next/link";
import Image from "next/image";
import type { ApiPlayer } from "@/lib/api/types";
import { buildPlayerCompanionHref } from "@/lib/api/player-companion";
import { formatDateTime, formatRelativeTime } from "@/lib/format";
import { getPlayerPresence } from "@/lib/presence";

type PlayerRowProps = {
  player: ApiPlayer;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PlayerRow({ player }: PlayerRowProps) {
  const presence = getPlayerPresence(player);

  return (
    <Link
      href={buildPlayerCompanionHref("party", player.uuid)}
      className="focus-ring grid gap-4 rounded-md border border-[#3f503f]/75 bg-[#111511]/90 p-4 transition duration-150 ease-out hover:-translate-y-0.5 hover:border-[#f0bf54]/75 hover:bg-[#1b211b] md:grid-cols-[72px_1fr_auto]"
    >
      <div className="grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-md border border-[#3f503f] bg-[#263126]">
        {player.skinUrl ? (
          <Image
            src={player.skinUrl}
            alt={`${player.name} skin`}
            width={72}
            height={72}
            className="pixel-art h-full w-full object-contain"
          />
        ) : (
          <span className="font-mono text-lg font-black text-[#f0bf54]">{getInitials(player.name)}</span>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-xl font-black text-[#fff5de]">{player.name}</h3>
          <span
            className={
              presence.isOnline
                ? "inline-flex items-center gap-1.5 rounded-md border border-[#7ed36f]/70 bg-[#17341c] px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#9ff28d]"
                : "inline-flex items-center gap-1.5 rounded-md border border-[#8c9a86]/55 bg-[#171a16] px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#c1b59a]"
            }
            title={
              presence.isStaleOnline
                ? "Backend marked this player online, but the last seen timestamp is stale."
                : undefined
            }
          >
            <span className="status-dot" />
            {presence.label}
          </span>
        </div>
        <p className="mt-2 break-all font-mono text-xs text-[#8c9a86]">{player.uuid}</p>
      </div>

      <dl className="grid min-w-44 gap-2 text-sm md:text-right">
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">Last seen</dt>
          <dd className="font-bold text-[#fff5de]" title={formatDateTime(player.lastSeen)}>
            {formatRelativeTime(player.lastSeen)}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">First seen</dt>
          <dd className="font-bold text-[#c1b59a]">{formatDateTime(player.firstSeen)}</dd>
        </div>
      </dl>
    </Link>
  );
}
