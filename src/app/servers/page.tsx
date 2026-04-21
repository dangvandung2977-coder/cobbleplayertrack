import { ServerCard } from "@/components/servers/ServerCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SectionPanel } from "@/components/ui/SectionPanel";
import { getServersWithPlayerCounts } from "@/lib/api/cobblemon";
import { getErrorMessage } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ServersPage() {
  let servers;

  try {
    servers = await getServersWithPlayerCounts();
  } catch (error) {
    return (
      <ErrorState
        message={`${getErrorMessage(error)} Check that the FastAPI backend is running and COBBLEMON_API_BASE_URL is configured.`}
      />
    );
  }

  const onlineServers = servers.filter((server) => server.online).length;
  const trackedPlayers = servers.reduce((total, server) => total + (server.trackedPlayerCount ?? 0), 0);

  return (
    <div className="space-y-6">
      <section className="game-panel-strong overflow-hidden p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#67d8cf]">PikaMC Command Center</p>
            <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight text-[#fff5de] sm:text-5xl">
              Cobblemon Live Tracker
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#c1b59a]">
              Monitor worlds, trainer presence, party data, and Pokedex progress from one fast dashboard.
            </p>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-end gap-4">
            <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Metric label="Servers" value={servers.length.toString()} />
              <Metric label="Online" value={onlineServers.toString()} tone="online" />
              <Metric label="Players" value={trackedPlayers.toString()} />
            </dl>
            <div className="hidden h-36 w-32 items-end justify-center sm:flex">
              <img
                src="/assets/cobblemon/pokemon-icons/regular/0448_lucario.png"
                alt=""
                className="pixel-art h-28 w-28 object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.42)]"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionPanel
        eyebrow="Network"
        title="Server Registry"
        description="Status, heartbeat recency, and roster size for each tracked server."
      >
        {servers.length === 0 ? (
          <EmptyState
            title="No servers registered"
            message="No server sightings have reached the registry yet."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {servers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        )}
      </SectionPanel>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "online";
}) {
  return (
    <div className="stat-tile px-4 py-3">
      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8c9a86]">{label}</dt>
      <dd className={tone === "online" ? "mt-1 text-2xl font-black text-[#7ed36f]" : "mt-1 text-2xl font-black text-[#fff5de]"}>
        {value}
      </dd>
    </div>
  );
}
