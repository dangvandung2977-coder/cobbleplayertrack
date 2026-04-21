import type { ReactNode } from "react";
import type { ApiPlayer } from "@/lib/api/types";
import {
  type PlayerCompanionPage,
} from "@/lib/api/player-companion";
import { PlayerHeader } from "@/components/players/PlayerHeader";
import { PlayerCompanionNav } from "@/components/players/PlayerCompanionNav";

type PlayerDashboardShellProps = {
  player: ApiPlayer;
  partyCount: number;
  activePage: PlayerCompanionPage;
  children: ReactNode;
};

export function PlayerDashboardShell({
  player,
  partyCount,
  activePage,
  children,
}: PlayerDashboardShellProps) {
  return (
    <div className="space-y-6">
      <PlayerHeader player={player} partyCount={partyCount} />
      <PlayerCompanionNav playerUuid={player.uuid} activePage={activePage} />
      <div className="animate-[fadeIn_160ms_ease-out]">{children}</div>
    </div>
  );
}
