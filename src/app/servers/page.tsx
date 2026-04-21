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

  return (
    <div className="space-y-6">
      <section className="game-panel-strong rounded-sm p-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">Field Console</p>
        <h1 className="mt-2 text-4xl font-black text-[#f4ead2]">Tracked Servers</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#b7a98b]">
          Live registry of Cobblemon worlds, recent sightings, and roster presence.
        </p>
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
