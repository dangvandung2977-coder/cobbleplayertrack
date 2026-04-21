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
      className="focus-ring game-panel-strong group block p-5 transition duration-150 ease-out hover:-translate-y-0.5 hover:border-[#f0bf54]/70"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#67d8cf]">{server.id}</p>
          <h3 className="mt-2 truncate text-2xl font-black text-[#fff5de]">{server.name}</h3>
          <p className="mt-1 text-sm text-[#c1b59a]">
            Minecraft {server.mcVersion} / Cobblemon {server.cobblemonVersion}
          </p>
        </div>

        <span
          className={
            server.online
              ? "inline-flex items-center gap-2 rounded-md border border-[#7ed36f]/70 bg-[#17341c] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#9ff28d]"
              : "inline-flex items-center gap-2 rounded-md border border-[#8c9a86]/55 bg-[#171a16] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#c1b59a]"
          }
        >
          <span className="status-dot" />
          {server.online ? "Online" : "Offline"}
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="stat-tile p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">Last seen</dt>
          <dd className="mt-1 font-bold text-[#fff5de]" title={formatDateTime(server.lastSeen)}>
            {formatRelativeTime(server.lastSeen)}
          </dd>
        </div>
        <div className="stat-tile p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">Players</dt>
          <dd className="mt-1 font-bold text-[#fff5de]">
            {server.trackedPlayerCount === undefined ? "Unknown" : server.trackedPlayerCount}
          </dd>
        </div>
      </dl>

      <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-[#67d8cf] transition group-hover:text-[#f0bf54]">
        Open player roster
      </p>
    </Link>
  );
}
