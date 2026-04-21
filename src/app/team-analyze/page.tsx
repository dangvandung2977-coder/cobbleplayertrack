import { ErrorState } from "@/components/ui/ErrorState";
import { TeamAnalyzePageShell } from "@/components/team-analyze/TeamAnalyzePageShell";
import { PlayerDashboardShell } from "@/components/players/PlayerDashboardShell";
import {
  getPlayerCompanionData,
  resolvePlayerUuidFromSearchParams,
} from "@/lib/api/player-companion";
import { getErrorMessage } from "@/lib/format";

export const dynamic = "force-dynamic";

type TeamAnalyzePageProps = {
  searchParams: Promise<{
    player?: string | string[];
    uuid?: string | string[];
  }>;
};

export default async function TeamAnalyzePage({
  searchParams,
}: TeamAnalyzePageProps) {
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
    const data = await getPlayerCompanionData(playerUuid);

    return (
      <PlayerDashboardShell
        player={data.player}
        partyCount={data.party.length}
        activePage="team-analyze"
      >
        <TeamAnalyzePageShell party={data.party} />
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
