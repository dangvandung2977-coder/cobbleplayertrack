import Link from "next/link";
import type { ServerSummary } from "@/lib/api/types";
import { formatDateTime, formatRelativeTime } from "@/lib/format";

type ServerCardProps = {
  server: ServerSummary;
};

export function ServerCard({ server }: ServerCardProps) {
  return (
    <Link
      href={`/servers/${server.id}`}
      className="focus-ring game-panel-strong group block rounded-sm p-5 transition hover:-translate-y-0.5 hover:border-[#d7ae45]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">{server.id}</p>
          <h3 className="mt-2 truncate text-2xl font-black text-[#f4ead2]">{server.name}</h3>
          <p className="mt-1 text-sm text-[#b7a98b]">
            Minecraft {server.mcVersion} / Cobblemon {server.cobblemonVersion}
          </p>
        </div>

        <span
          className={
            server.online
              ? "border border-[#79b86a]/70 bg-[#17301c] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#9be18c]"
              : "border border-[#83785f]/70 bg-[#191a16] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#b7a98b]"
          }
        >
          {server.online ? "Online" : "Offline"}
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">Last seen</dt>
          <dd className="mt-1 font-bold text-[#f4ead2]" title={formatDateTime(server.lastSeen)}>
            {formatRelativeTime(server.lastSeen)}
          </dd>
        </div>
        <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">Players</dt>
          <dd className="mt-1 font-bold text-[#f4ead2]">
            {server.trackedPlayerCount === undefined ? "Unknown" : server.trackedPlayerCount}
          </dd>
        </div>
      </dl>

      <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-[#59c7d4] group-hover:text-[#f4ead2]">
        Open player roster
      </p>
    </Link>
  );
}
