import { ErrorState } from "@/components/ui/ErrorState";

export default function PlayerNotFound() {
  return (
    <ErrorState
      title="Player not found"
      message="This trainer UUID was not present in the current backend records."
      actionHref="/servers"
      actionLabel="Back to servers"
    />
  );
}
