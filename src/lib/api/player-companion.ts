import type { ApiPlayer, PartyPokemon, PokedexEntry } from "@/lib/api/types";
import { getErrorMessage } from "@/lib/format";
import { getParty, getPlayerProfile, getPokedex } from "@/lib/api/cobblemon";

export type PlayerCompanionPage = "party" | "pokedex" | "team-analyze";

export type PlayerCompanionData = {
  player: ApiPlayer;
  party: PartyPokemon[];
  pokedexEntries: PokedexEntry[] | null;
  pokedexError: string | null;
};

type SearchParamValue = string | string[] | undefined;

function readSearchParam(value: SearchParamValue) {
  const resolved = Array.isArray(value) ? value[0] : value;
  return typeof resolved === "string" && resolved.trim() ? resolved.trim() : null;
}

export function resolvePlayerUuidFromSearchParams(
  searchParams: Record<string, SearchParamValue>,
) {
  return readSearchParam(searchParams.player) ?? readSearchParam(searchParams.uuid);
}

export function buildPlayerCompanionHref(page: PlayerCompanionPage, playerUuid: string) {
  const params = new URLSearchParams({ player: playerUuid });
  return `/${page}?${params.toString()}`;
}

export async function getPlayerCompanionData(
  playerUuid: string,
  options: {
    includePokedex?: boolean;
  } = {},
): Promise<PlayerCompanionData> {
  const [player, partyResponse] = await Promise.all([getPlayerProfile(playerUuid), getParty(playerUuid)]);
  let pokedexEntries: PokedexEntry[] | null = null;
  let pokedexError: string | null = null;

  if (options.includePokedex) {
    const pokedexResult = await Promise.allSettled([getPokedex(playerUuid)]);
    if (pokedexResult[0].status === "fulfilled") {
      pokedexEntries = pokedexResult[0].value.entries;
    } else {
      pokedexError = getErrorMessage(pokedexResult[0].reason);
    }
  }

  return {
    player,
    party: partyResponse.party,
    pokedexEntries,
    pokedexError,
  };
}
