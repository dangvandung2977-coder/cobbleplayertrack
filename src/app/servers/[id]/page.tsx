import { notFound } from "next/navigation";
import { ServerHeader } from "@/components/servers/ServerHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { ServerPlayersList } from "@/components/players/ServerPlayersList";
import { getServerById, getServerPlayers } from "@/lib/api/cobblemon";
import { getErrorMessage } from "@/lib/format";

export const dynamic = "force-dynamic";

type ServerDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ServerDetailPage({ params }: ServerDetailPageProps) {
  const { id } = await params;
  let server;
  let players;

  try {
    [server, players] = await Promise.all([getServerById(id), getServerPlayers(id)]);
  } catch (error) {
    return (
      <ErrorState
        message={`${getErrorMessage(error)} Check that the FastAPI backend is running and the server id is valid.`}
        actionHref="/servers"
        actionLabel="Back to servers"
      />
    );
  }

  if (!server) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ServerHeader server={server} playerCount={players.length} />
      <ServerPlayersList players={players} />
    </div>
  );
}
