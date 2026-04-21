import type { ApiServer } from "@/lib/api/types";
import { formatDateTime, formatRelativeTime } from "@/lib/format";

type ServerHeaderProps = {
  server: ApiServer;
  playerCount: number;
};

export function ServerHeader({ server, playerCount }: ServerHeaderProps) {
  return (
    <header className="game-panel-strong p-5 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#67d8cf]">{server.id}</p>
          <h1 className="mt-2 text-4xl font-black text-[#fff5de]">{server.name}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#c1b59a]">
            Minecraft {server.mcVersion} / Cobblemon {server.cobblemonVersion} / Bridge {server.modVersion}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span
            className={
              server.online
                ? "inline-flex items-center gap-2 rounded-md border border-[#7ed36f]/70 bg-[#17341c] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#9ff28d]"
                : "inline-flex items-center gap-2 rounded-md border border-[#8c9a86]/55 bg-[#171a16] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#c1b59a]"
            }
          >
            <span className="status-dot" />
            {server.online ? "Online" : "Offline"}
          </span>
          <span className="rounded-md border border-[#3f503f] bg-[#111511] px-4 py-2 text-sm font-black text-[#fff5de]">
            {playerCount} tracked players
          </span>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-tile p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">Last seen</dt>
          <dd className="mt-1 font-bold text-[#fff5de]" title={formatDateTime(server.lastSeen)}>
            {formatRelativeTime(server.lastSeen)}
          </dd>
        </div>
        <div className="stat-tile p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">Registered</dt>
          <dd className="mt-1 font-bold text-[#fff5de]">{formatDateTime(server.createdAt)}</dd>
        </div>
        <div className="stat-tile p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">IP</dt>
          <dd className="mt-1 truncate font-bold text-[#fff5de]">{server.ip ?? "Not reported"}</dd>
        </div>
        <div className="stat-tile p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">Updated</dt>
          <dd className="mt-1 font-bold text-[#fff5de]">{formatRelativeTime(server.updatedAt)}</dd>
        </div>
      </dl>
    </header>
  );
}
