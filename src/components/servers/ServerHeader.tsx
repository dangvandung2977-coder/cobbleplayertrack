import type { ApiServer } from "@/lib/api/types";
import { formatDateTime, formatRelativeTime } from "@/lib/format";

type ServerHeaderProps = {
  server: ApiServer;
  playerCount: number;
};

export function ServerHeader({ server, playerCount }: ServerHeaderProps) {
  return (
    <header className="game-panel-strong rounded-sm p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">{server.id}</p>
          <h1 className="mt-2 text-4xl font-black text-[#f4ead2]">{server.name}</h1>
          <p className="mt-3 max-w-3xl text-sm text-[#b7a98b]">
            Minecraft {server.mcVersion} / Cobblemon {server.cobblemonVersion} / Bridge {server.modVersion}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span
            className={
              server.online
                ? "border border-[#79b86a]/70 bg-[#17301c] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#9be18c]"
                : "border border-[#83785f]/70 bg-[#191a16] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#b7a98b]"
            }
          >
            {server.online ? "Online" : "Offline"}
          </span>
          <span className="border border-[#4d5736] bg-[#15180f] px-4 py-2 text-sm font-black text-[#f4ead2]">
            {playerCount} tracked players
          </span>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">Last seen</dt>
          <dd className="mt-1 font-bold text-[#f4ead2]" title={formatDateTime(server.lastSeen)}>
            {formatRelativeTime(server.lastSeen)}
          </dd>
        </div>
        <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">Registered</dt>
          <dd className="mt-1 font-bold text-[#f4ead2]">{formatDateTime(server.createdAt)}</dd>
        </div>
        <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">IP</dt>
          <dd className="mt-1 truncate font-bold text-[#f4ead2]">{server.ip ?? "Not reported"}</dd>
        </div>
        <div className="border border-[#4d5736]/70 bg-[#15180f]/80 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#83785f]">Updated</dt>
          <dd className="mt-1 font-bold text-[#f4ead2]">{formatRelativeTime(server.updatedAt)}</dd>
        </div>
      </dl>
    </header>
  );
}
