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
      className="focus-ring grid gap-4 border border-[#4d5736]/70 bg-[#15180f]/85 p-4 transition hover:border-[#d7ae45]/80 hover:bg-[#1b1f16] md:grid-cols-[72px_1fr_auto]"
    >
      <div className="grid h-[72px] w-[72px] place-items-center overflow-hidden border border-[#4d5736] bg-[#252a1d]">
        {player.skinUrl ? (
          <Image
            src={player.skinUrl}
            alt={`${player.name} skin`}
            width={72}
            height={72}
            className="h-full w-full object-contain [image-rendering:pixelated]"
          />
        ) : (
          <span className="font-mono text-lg font-black text-[#d7ae45]">{getInitials(player.name)}</span>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-xl font-black text-[#f4ead2]">{player.name}</h3>
          <span
            className={
              presence.isOnline
                ? "border border-[#79b86a]/70 bg-[#17301c] px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#9be18c]"
                : "border border-[#83785f]/70 bg-[#191a16] px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#b7a98b]"
            }
            title={
              presence.isStaleOnline
                ? "Backend marked this player online, but the last seen timestamp is stale."
                : undefined
            }
          >
            {presence.label}
          </span>
        </div>
        <p className="mt-2 break-all font-mono text-xs text-[#83785f]">{player.uuid}</p>
      </div>

      <dl className="grid min-w-44 gap-2 text-sm md:text-right">
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">Last seen</dt>
          <dd className="font-bold text-[#f4ead2]" title={formatDateTime(player.lastSeen)}>
            {formatRelativeTime(player.lastSeen)}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">First seen</dt>
          <dd className="font-bold text-[#b7a98b]">{formatDateTime(player.firstSeen)}</dd>
        </div>
      </dl>
    </Link>
  );
}
