import type { ApiPlayer } from "@/lib/api/types";

const PLAYER_ONLINE_FRESH_MS = 2 * 60 * 1000;

export function getPlayerPresence(player: ApiPlayer, now = Date.now()) {
  const lastSeenTime = new Date(player.lastSeen).getTime();
  const hasValidLastSeen = Number.isFinite(lastSeenTime);
  const ageMs = hasValidLastSeen ? now - lastSeenTime : Number.POSITIVE_INFINITY;
  const lastSeenIsFresh = ageMs >= -PLAYER_ONLINE_FRESH_MS && ageMs <= PLAYER_ONLINE_FRESH_MS;
  const isOnline = player.isOnline && lastSeenIsFresh;

  return {
    isOnline,
    label: isOnline ? "Online" : "Offline",
    isStaleOnline: player.isOnline && !lastSeenIsFresh,
    freshnessSeconds: PLAYER_ONLINE_FRESH_MS / 1000,
  };
}
