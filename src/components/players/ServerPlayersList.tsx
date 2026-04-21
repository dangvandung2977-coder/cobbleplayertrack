"use client";

import { useMemo, useState } from "react";
import type { ApiPlayer } from "@/lib/api/types";
import { PlayerRow } from "@/components/players/PlayerRow";
import { SearchBar } from "@/components/search/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionPanel } from "@/components/ui/SectionPanel";

type ServerPlayersListProps = {
  players: ApiPlayer[];
};

export function ServerPlayersList({ players }: ServerPlayersListProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPlayers = useMemo(() => {
    if (!normalizedQuery) {
      return players;
    }

    return players.filter((player) => player.name.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery, players]);

  return (
    <SectionPanel
      eyebrow="Roster"
      title="Tracked Players"
      description="Player sightings, status, and last known presence for this server."
      actions={
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search player name"
          label="Search players by name"
        />
      }
    >
      {players.length === 0 ? (
        <EmptyState
          title="No players tracked yet"
          message="No roster data has reached this server yet."
        />
      ) : filteredPlayers.length === 0 ? (
        <EmptyState title="No matching players" message="Try a different player name." />
      ) : (
        <div className="space-y-3">
          {filteredPlayers.map((player) => (
            <PlayerRow key={player.uuid} player={player} />
          ))}
        </div>
      )}
    </SectionPanel>
  );
}
