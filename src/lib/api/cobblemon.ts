import type {
  ApiPlayer,
  ApiServer,
  PartyResponse,
  PokedexResponse,
  ServerPlayersResponse,
  ServerSummary,
  ServersListResponse,
} from "@/lib/api/types";

const API_BASE_URL =
  process.env.COBBLEMON_API_BASE_URL ??
  process.env.NEXT_PUBLIC_COBBLEMON_API_BASE_URL ??
  "http://localhost:8000";

const API_REQUEST_TIMEOUT_MS = 7000;

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiRequestError(
        `Backend request timed out for ${path}. Check the API database connection.`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new ApiRequestError(
      `Backend request failed for ${path} (${response.status})`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export async function getServers(): Promise<ApiServer[]> {
  const response = await apiFetch<ServersListResponse>("/api/servers");
  return response.servers;
}

export async function getServerById(serverId: string): Promise<ApiServer | null> {
  const servers = await getServers();
  return servers.find((server) => server.id === serverId) ?? null;
}

export async function getServerPlayers(serverId: string): Promise<ApiPlayer[]> {
  const response = await apiFetch<ServerPlayersResponse>(`/api/servers/${serverId}/players`);
  return response.players;
}

export async function getServersWithPlayerCounts(): Promise<ServerSummary[]> {
  const servers = await getServers();
  const countResults = await Promise.allSettled(
    servers.map(async (server) => {
      const players = await getServerPlayers(server.id);
      return [server.id, players.length] as const;
    }),
  );

  const counts = new Map<string, number>();
  for (const result of countResults) {
    if (result.status === "fulfilled") {
      counts.set(result.value[0], result.value[1]);
    }
  }

  return servers.map((server) => ({
    ...server,
    trackedPlayerCount: counts.get(server.id),
  }));
}

export async function getPlayerProfile(playerUuid: string): Promise<ApiPlayer> {
  return apiFetch<ApiPlayer>(`/api/players/${playerUuid}`);
}

export async function getParty(playerUuid: string): Promise<PartyResponse> {
  return apiFetch<PartyResponse>(`/api/players/${playerUuid}/party`);
}

export async function getPokedex(playerUuid: string): Promise<PokedexResponse> {
  return apiFetch<PokedexResponse>(`/api/players/${playerUuid}/pokedex`);
}
