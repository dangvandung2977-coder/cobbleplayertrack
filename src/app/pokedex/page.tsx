import { ErrorState } from "@/components/ui/ErrorState";
import { PokedexPageShell } from "@/components/pokedex/PokedexPageShell";
import { PlayerDashboardShell } from "@/components/players/PlayerDashboardShell";
import {
  getPlayerCompanionData,
  resolvePlayerUuidFromSearchParams,
} from "@/lib/api/player-companion";
import { getErrorMessage } from "@/lib/format";

export const dynamic = "force-dynamic";

type PokedexPageProps = {
  searchParams: Promise<{
    player?: string | string[];
    uuid?: string | string[];
  }>;
};

export default async function PokedexPage({ searchParams }: PokedexPageProps) {
  const playerUuid = resolvePlayerUuidFromSearchParams(await searchParams);

  if (!playerUuid) {
    return (
      <ErrorState
        titleKey="states.noTrainerSelectedTitle"
        messageKey="states.noTrainerSelectedMessage"
        actionHref="/servers"
        actionLabelKey="states.backToServers"
      />
    );
  }

  try {
    const data = await getPlayerCompanionData(playerUuid, { includePokedex: true });

    return (
      <PlayerDashboardShell
        player={data.player}
        partyCount={data.party.length}
        activePage="pokedex"
      >
        <PokedexPageShell
          entries={data.pokedexEntries}
          party={data.party}
          errorMessage={data.pokedexError}
        />
      </PlayerDashboardShell>
    );
  } catch (error) {
    return (
      <ErrorState
        messageKey="states.backendProfilePartyReachable"
        messageValues={{ error: getErrorMessage(error) }}
        actionHref="/servers"
        actionLabelKey="states.backToServers"
      />
    );
  }
}
